import { sendSuccess, sendError } from "../utils/response"
import {natClient} from '../app'
import * as nats from  '../utils/nats'
import * as things from '../helper/things'
import { hassApi } from '../configs/common'
import * as proto from '../utils/protobuf'
import * as helper from '../helper/common'

export async function forwardHass(req, res) {
    try {
        let { hassData, gatewayId } = req.body
        let time = Date.now().toString()
        
        const token = req.headers.authorization
        let payload = helper.objectToBase64(hassData)
        const control_cnl = await things.getControlChannelGtw(gatewayId, token)

        const message = await proto.createMessage(control_cnl, `services/${hassApi.CONFIG}/${time}`, payload)

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