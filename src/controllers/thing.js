import * as svcThing from "../services/svc-thing"
import { valUpdateInfo } from '../helper/validate'
import { sendSuccess, sendError } from "../utils/response"
import {natClient} from '../app'
import * as things from '../helper/things'
import * as helper from '../helper/common'
import * as proto from '../utils/protobuf'

export function getAllGateway(req, res) {
    const token = req.headers.authorization
    svcThing.getAllGateway(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function callSocket(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { hassData, gatewayid } = req.body
            const token = req.headers.authorization
            if (!valUpdateInfo(gatewayid)) {
                sendError(req, res)
            }
            const control_cnl = await things.getControlChannelGtw(gatewayid, token)
            let payload = helper.objectToBase64(hassData)

            const message = await proto.createMessage(control_cnl, `services/socket`, payload)
            natClient.forwardNat('channels.socket', message)
            // subscribe 
            sendSuccess(req, res)({data: ""})
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

export function getGateway(req, res){
    const token = req.headers.authorization
    svcThing.svcGetGtw(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function getGatewayById(req, res){
    const {gateway_id} = req.params
    const token = req.headers.authorization
    svcThing.svcGetGtw(token, gateway_id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}