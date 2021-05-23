import * as svcThing from "../services/svc-thing"
import { valUpdateInfo } from '../helper/validate'
import { sendSuccess, sendError } from "../utils/response"
import { natClient } from '../app'
import * as nats from '../utils/nats'
import * as things from '../helper/things'
import * as helper from '../helper/common'
import * as proto from '../utils/protobuf'

export async function getAllGateway(req, res) {
    const token = req.headers.authorization
    await svcThing.getAllGateway(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function callSocket(req, res) {
    try {
        const { hassData, controlChannel } = req.body
        if (controlChannel == "") {
            sendError(req, res)("Failed validation")
            return;
        }
        let payload = helper.objectToBase64(hassData)

        const message = await proto.createMessage(controlChannel, `services/socket`, payload)
        natClient.forwardNat('channels.socket', message)
        // subscribe 
        sendSuccess(req, res)({ data: "" })
    } catch (e) {
        sendError(req, res)(e)
    }
}

export async function callSocketSync(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            let { hassData, controlChannel } = req.body
            let time = Date.now().toString()
            let payload = helper.objectToBase64(hassData)
            const message = await proto.createMessage(controlChannel, `services/socketsync/${time}`, payload)

            natClient.forwardNat(`channels.socketsync`, message)

            await natClient.subscribe(`channels.*.*.gateway.socketsync.${time}`, async (msgNat) => {
                let msg = await nats.decodeMessageNat(msgNat.data)
                try{
                    let data = JSON.parse(msg)
                    sendSuccess(req, res)({
                        data: data.data
                    })
                }catch(e) {
                    sendError(req, res)({
                        data: msg
                    })
                }
            })
        } catch (e) {
            sendError(req, res)(e)
        }
    })
}

export function createGateway(req, res) {
    const token = req.headers.authorization
    const { id, key, name } = req.body
    if (id == null || id == "" || key == null || key == "" || name == null || name == "") {
        sendError(req, res)
    }
    svcThing.svcCreateGtw(id, key, name, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function getGateway(req, res) {
    const token = req.headers.authorization
    svcThing.svcGetGtw(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function getGatewayById(req, res) {
    const { gateway_id } = req.params
    const token = req.headers.authorization
    svcThing.svcGetGtw(token, gateway_id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}