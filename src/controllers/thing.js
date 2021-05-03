import * as svcThing from "../services/svc-thing"
import { valUpdateInfo } from '../helper/validate'
import { sendSuccess, sendError } from "../helper/response"
import {natClient} from '../app'
import * as nats from '../configs/nats'
import * as gateways from '../helper/gateways'
import * as things from '../helper/things'
import common, { hassApi } from '../configs/common'
import * as helper from '../helper/common'

export function getAll(req, res) {
    const token = req.headers.authorization
    svcThing.getAll(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function createThing(req, res) {
    try {
        const token = req.headers.authorization
        let { name, apitoken, IP, gatewayId } = req.body
        const { subtopicReq, topicRes, id, key, control_cnl } = await gateways.getInfo(gatewayId, hassApi.ADD_DEVICE, token)
        const payload = helper.unpack(JSON.stringify({ apitoken, IP }))
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        natClient.forwardNat(nats.getTopic(control_cnl), msg)

        svcThing.svcCreate(name, apitoken, token)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res))
    } catch (e) {
        console.log(e)
        sendError(e)
    }
}

export async function getDeviceOfGateway(req, res) {
    const token = req.headers.authorization
    const {gateway_id} = req.params
    svcThing.getByGateway(token, gateway_id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function updateThingInfo(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { thingid, action, gatewayid } = req.body
            const token = req.headers.authorization
            if (!valUpdateInfo(thingid, action, gatewayid)) {
                sendError(req, res)
            }
            
            const { subtopicReq, control_cnl } = await gateways.getInfo(gatewayid, hassApi.SERVICE, token)
            
            // sonoff_1000b84612
            const payload = helper.unpack(`${action}.${thingid}`)
            const msg = {
                channel: control_cnl,
                subtopic: `services/${hassApi.SERVICE}`,
                payload: payload
            }
    
            natClient.forwardNat(nats.getTopic(control_cnl), msg)
            // subscribe 
            sendSuccess(req, res)({data: ""})
        } catch (e) {
            sendError(req, res)(e)
        }
    })
}

export async function deleteThing(req, res) {
    try {
        const token = req.headers.authorization
        let { thingId, gatewayId } = req.body

        if(gatewayId){
            svcThing.svcDisable(gatewayId, token)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res))
        }else{
            const extKeyThing = await things.getExtKeyThing(thingId, token)
            const payload = helper.unpack(JSON.stringify({ external_key: extKeyThing }))
            const msg = {
                channel: control_cnl,
                subtopic: `services/${common.SERVICE}`,
                payload: payload
            }
            natClient.forwardNat("channels.change_state", msg)
        }
    } catch (e) {
        sendError(e)
    }
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

export async function scanThing(req, res) {
    try {
        const { gateway_id } = req.params;
        const token = req.headers.authorization

        const { control_cnl } = await gateways.getInfo(gateway_id, hassApi.SCAN_DEVICE, token) 

        const msg = {
            channel: control_cnl,
            subtopic: `services/${hassApi.SCAN_DEVICE}`,
            payload: helper.unpack("Messages")
        }
        natClient.forwardNat("channels.scanthing", msg)
        sendSuccess(req, res)({
            data: ""
        })
    } catch (e) {
        sendError(req, res)(e)
    }
}