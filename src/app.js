import express from "express"
import UserRouter from "./routes/user"
import cors from "cors"
import ThingRouter from "./routes/thing"
import * as nats from './configs/nats'
import {handleData} from './handler/handler'
var WebSocketServer = require('websocket').server;
var http = require('http');

const app = express();
let wsClient = []

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)

var server = http.createServer(app);

let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    if(request.resourceURL.pathname){
        let clientId = request.resourceURL.pathname.substring(1)
        wsClient[clientId] = connection
    }
});

export const natClient = nats.natClient()

const realTime = async function() {
    if(!natClient.nc)
    {
        natClient.nc = await nats.createConn()
    }
    const sub = natClient.nc.subscribe("channels.*.*.gateway");
    (async () => {
        for await (const m of sub) {
            let msg = await nats.decodeMessageNat(m.data)
            console.log({msg})
            await handleData(m.subject, msg)
        }
        console.log("subscription closed");
    })();
}

realTime()

export {server, wsClient}
