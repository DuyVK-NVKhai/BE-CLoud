import express from "express"
import cors from "cors"
import UserRouter from "./routes/user"
import ThingRouter from "./routes/thing"
import ConfigRouter from './routes/config'
import * as nats from './utils/nats'
import {createWbs} from './utils/websocket'
var http = require('http');

const app = express();
const natClient = nats.natClient()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)
app.use("/api/config", ConfigRouter)

var server = http.createServer(app);

let {wsClient} = createWbs(server)
natClient.subscribe(nats.getChnlRealtime(), nats.handleRealtime)

export {server, wsClient, natClient}
