import { sendSuccess, sendError } from "../utils/response"
import {natClient} from '../app'
import * as nats from  '../utils/nats'
import * as things from '../helper/things'
import { hassApi } from '../configs/common'
import * as helper from '../helper/common'
const Schema = require('../protobuf/message_pb')

export async function forwardHass(req, res) {
    try {
        const token = req.headers.authorization
        let { url, method, body, gatewayId } = req.body
        const { control_cnl } = await things.getInfoGateway(gatewayId, hassApi.CONFIG, token)
        let time = Date.now().toString()
        let payload
        if(method == "GET" || method == "DELETE"){
            let objJsonStr = JSON.stringify({url, method});
            payload = Buffer.from(objJsonStr).toString("base64");
        }else{
            let objJsonStr = JSON.stringify({url, method, body});
            payload = Buffer.from(objJsonStr).toString("base64");
        }

        const message = new Schema.Message()
        message.setChannel(control_cnl)
        message.setSubtopic(`services/${hassApi.CONFIG}/${time}`)
        message.setPayload(payload)

        natClient.forwardNat(`channels.abc`, message)

        await natClient.subscribe(`channels.*.*.gateway.${time}`, async (msgNat)=>{
            let msg = await nats.decodeMessageNat(msgNat.data)
            let {data} = JSON.parse(msg)
            sendSuccess(req, res)({
                data
            })
        })
        
    } catch (e) {
        console.log(e)
        sendError(e)
    }
}