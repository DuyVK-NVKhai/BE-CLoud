import * as svcThing from "../services/svc-thing"
import { valUpdateInfo } from '../helper/validate'
import { sendSuccess, sendError } from "../helper/response"
import {natClient} from '../app'
import * as nats from '../configs/nats'
import * as gateways from '../helper/gateways'
import * as things from '../helper/things'
import { hassApi } from '../configs/common'
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

        let result = await natClient.subscribeNat(nats.getTopic(control_cnl))

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
            const { thingid, action, gatewayid, key } = req.body
            const token = req.headers.authorization
            if (!valUpdateInfo(thingid, action, gatewayid)) {
                sendError(req, res)
            }
            
            const { subtopicReq, control_cnl } = await gateways.getInfo(gatewayid, hassApi.SERVICE, token)
            
            // sonoff_1000b84612
            const payload = helper.unpack(`${action}.${key}`)
            const msg = {
                channel: control_cnl,
                subtopic: subtopicReq,
                payload: payload
            }
    
            natClient.forwardNat(nats.getTopic(control_cnl), msg)
            // subscribe 

            let result = await natClient.subscribeNat(nats.getTopic(control_cnl))
            result = JSON.parse(result.toString())
            if(result.Data && result.Data.success){
                // svcThing.updateInfo(thingid, action, metadata)
                // .then(sendSuccess(req, res))
                // .catch(sendError(req, res))
            }
    
            // do something
            sendSuccess(req, res)(result)
        } catch (e) {
            sendError(req, res)(e)
        }
    })
}

export async function deleteThing(req, res) {
    try {
        const token = req.headers.authorization
        let { thingId, gatewayId } = req.body

        const { subtopicReq, topicRes, id, key } = await gateways.getInfo(gatewayId, hassApi.DELETE_DEVICE, token)
        const extKeyThing = await things.getExtKeyThing(thingId, token)
        const payload = helper.unpack(JSON.stringify({ external_key: extKeyThing }))
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        natClient.forwardNat(nats.getTopic(control_cnl), msg)

        let result = await natClient.subscribeNat(nats.getTopic(control_cnl))

        console.log("Message from topic " + topicRes + ": " + result)

        svcThing.svcDisable(thingId, token)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res))
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

        const { subtopicReq, topicRes, control_cnl, id, key } = await gateways.getInfo(gateway_id, hassApi.SCAN_DEVICE, token)

        const payload = helper.unpack("Message")
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        natClient.forwardNat("channels.scanthing", msg)
        let result = await natClient.subscribeNat(nats.getTopic(control_cnl))
        // let listDevice = result.Data;
        // console.log({listDevice})
        // let allDevice = await svcThing.getByGateway(token, gateway_id)
        // console.log({allDevice});
        // // add device new to db
        // allDevice.forEach((dvc) => {
        //     console.log({dvc})
        //     // let index = listDevice.result.indexOf(m => m.entity_id == dvc.metadata.)
        // })
        // do something
        sendSuccess(req, res)({
            status: result.Data.success,
            data: result.Data
        })
    } catch (e) {
        sendError(req, res)(e)
    }
}