import express from "express"
import UserRouter from "./routes/user"
import cors from "cors"
import ThingRouter from "./routes/thing"
import * as nats from './configs/nats'
import {createWbs} from './configs/websocket'
var http = require('http');

const app = express();
export const natClient = nats.natClient()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)

var server = http.createServer(app);

let {wsClient} = createWbs(server)

natClient.subscribe(nats.getChnlRealtime(), nats.handleRealtime)

export {server, wsClient}
