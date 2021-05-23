import { sendSuccess, sendError } from "../utils/response"
import {natClient} from '../app'
import * as nats from  '../utils/nats'
import * as things from '../helper/things'
import { hassApi } from '../configs/common'
import * as proto from '../utils/protobuf'
import * as helper from '../helper/common'

export async function forwardHass(req, res) {
    try {
        let { hassData, controlChannel } = req.body
        let time = Date.now().toString()
        
        let payload = helper.objectToBase64(hassData)
        const message = await proto.createMessage(controlChannel, `services/http/${time}`, payload)
        natClient.forwardNat(`channels.http`, message)

        await natClient.subscribe(`channels.*.*.gateway.http.${time}`, async (msgNat)=>{
            let msg = await nats.decodeMessageNat(msgNat.data)
            try{
                let data = JSON.parse(msg)
                sendSuccess(req, res)({
                    data
                })
            }catch(e) {
                console.log(e)
                sendError(req, res)({
                    data: msg
                })
            }
        })
        
    } catch (e) {
        console.log(e)
        sendError(e)
    }
}