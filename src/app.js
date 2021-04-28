import express from "express"
import UserRouter from "./routes/user"
import cors from "cors"
import ThingRouter from "./routes/thing"
import * as svcThing from "./services/svc-thing"
import * as helper from './helper/common'
import * as socketIo from "./configs/socket"
import * as nats from './configs/nats'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/user", UserRouter)
app.use("/api/thing", ThingRouter)

export const natClient = nats.natClient()

//channels.49610741-71eb-4b34-906f-f02c2ac1a9e5.export.realtime.raspberry-104
// while (true) {
//     let sub = natClient.subscribeNat(natcn, "channels.*.*.realtime.*")
//     console.log(sub)
// }

// subMqtt.on('message',async function (topic, payload, packet) {
//     try{
//         console.log({topic})
//         const message = helper.bin2string(payload)
//         let channelId = getChannelByTopic(topic)
//         let extId = getExternalIdByTopic(topic)
//         let id = message.event.data.entity_id
//         // let thingId = await svcThing.getThingByEntity(id, channelId, token)
//         let data = {
//             metadata: message.event.data.new_state,
//             name: "sddfs"
//         }

//         socketIo.emit(extId, JSON.stringify(data))
//     } catch(e) {
//         console.log("Realtime error: ", e)
//     }
// })


export {app}