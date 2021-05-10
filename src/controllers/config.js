import { sendSuccess, sendError } from "../utils/response"
import {natClient} from '../app'
import * as nats from  '../utils/nats'
import * as things from '../helper/things'
import { hassApi } from '../configs/common'
import * as helper from '../helper/common'
export async function forwardHass(req, res) {
    try {
        const token = req.headers.authorization
        let { url, method, body, gatewayId } = req.body
        const { control_cnl } = await things.getInfoGateway(gatewayId, hassApi.CONFIG, token)
        let time = Date.now().toString()
        let payload
        if(method == "GET" || method == "DELETE"){
            payload = helper.unpack(JSON.stringify({ url, method }))
        }else{
            payload = helper.unpack(JSON.stringify({ url, method, body}))
        }

        const msg = {
            channel: control_cnl,
            subtopic: `services/${hassApi.CONFIG}/${time}`,
            payload
        }
        natClient.forwardNat(`channels.abc`, msg)

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