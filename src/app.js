import express from "express"
import UserRouter from "./routes/user"
import cors from "cors"
import ThingRouter from "./routes/thing"
import {subscribeNat} from './configs/nats'
import * as mqttCli from './configs/mqtt'
import * as svcThing from "./services/svc-thing"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)
subscribeNat("channels.>")

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTc1Njc2MzUsImlhdCI6MTYxNzUzMTYzNSwiaXNzIjoibWFpbmZsdXguYXV0aCIsInN1YiI6InBpQGdtYWlsLmNvbSIsImlzc3Vlcl9pZCI6IjYxMTE1MmI3LWZmYWMtNDUxMC1hYjNhLTQwMWI3Zjc4MDVkYyIsInR5cGUiOjB9.uLQ-S_i2X54_tSNFnZIaZaerZsMf7dSyMkkLTImHkBg"

const subMqtt = mqttCli.createSub("channels/86d2e735-96da-4956-97fa-2cf1b0416007/messages/export/raspberry-104", "24536332-a182-45d1-92df-c41024d9351c", "3e1caa87-53c8-4c42-93a1-0e474c2a83f9")
subMqtt.on('message',async function (topic, payload, packet) {
    let message = JSON.parse(payload.toString())
    message = JSON.parse(message.Data)
    let id = message.event.data.entity_id
    let thingId = await svcThing.getThingByEntity(id, "86d2e735-96da-4956-97fa-2cf1b0416007", token)
    let data = {
        metadata: message.event.data.new_state,
        name: "sddfs"
    }
    if(thingId){
        svcThing.updateThing(thingId, "", JSON.stringify(data), token)
    }
})


export {app}