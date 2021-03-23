import * as svcThing from "../services/svc-thing"
import { valUpdateInfo } from '../helper/validate'
import { sendSuccess, sendError } from "../helper/response"
import * as mqttCli from '../configs/mqtt'
import nats from '../configs/nats'
import * as gateways from '../helper/gateways'
import * as things from '../helper/things'
import {hassApi} from '../configs/common'

export function getAll(req, res) {
    const token = req.headers.authorization
    svcThing.getAll(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function createGateway(req, res) {
    const token = req.headers.authorization
    const { id, key } = req.body
    if (id == null || id == "" || key == null || key == "") {
        sendError(req, res)
    }
    svcThing.svcCreateGtw(id, key, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function createThing(req, res) {
    try{
        const token = req.headers.authorization
        let { name, extKey, gatewayId } = req.body
        
        const {subtopicReq, topicRes, id, key} = await gateways.getTopic(gatewayId, hassApi.ADD_DEVICE, token)

        const payload = unpack(JSON.stringify({external_key: extKey}))
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        nats.forwardNat(nats.getTopic(control_cnl), msg)

        let result = await mqttCli.subscribe(topicRes, id, key)

        console.log("Subcribe mqtt on topic: ", topicRes)
        console.log("Message from topic " + topicRes + ": " + result )

        svcThing.svcCreate(name, extKey, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
    }catch(e){
        sendError(e)
    }
}

export async function deleteThing(req, res){
    try{
        const token = req.headers.authorization
        let { thingId, gatewayId } = req.body
        
        const {subtopicReq, topicRes, id, key} = await gateways.getTopic(gatewayId, hassApi.DELETE_DEVICE, token)

        const extKeyThing = await things.getExtKeyThing(thingId, token)
        const payload = unpack(JSON.stringify({external_key: extKeyThing}))
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        nats.forwardNat(nats.getTopic(control_cnl), msg)

        let result = await mqttCli.subscribe(topicRes, id, key)

        console.log("Subcribe mqtt on topic: ", topicRes)
        console.log("Message from topic " + topicRes + ": " + result )

        svcThing.svcDisable(thingId, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
    }catch(e){
        sendError(e)
    }
}

export async function scanThing(req, res) {
    try {
        const { gateway_id } = req.params;
        const token = req.headers.authorization
        
        const {subtopicReq, topicRes, id, key} = await gateways.getTopic(gateway_id, hassApi.SCAN_DEVICE, token)

        const payload = unpack("Hello, xin chao edge")
        const msg = {
            channel: control_cnl,
            subtopic: subtopicReq,
            payload: payload
        }
        nats.forwardNat(nats.getTopic(control_cnl), msg)

        // subscribe 
        let result = await mqttCli.subscribe(topicRes, id, key)

        console.log("Subcribe mqtt on topic: ", topic)
        console.log("Message from topic " + topic + ": " + result )
        // do something
        sendSuccess(req, res)(result)
    } catch (e) {
        sendError(req, res)(e)
    }
}

function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    return bytes;
}

export function updateThingInfo(req, res) {
    const { thingid, name, metadata } = req.body

    if (!valUpdateInfo(thingid, name, metadata)) {
        sendError(req, res)
    }

    svcThing.updateInfo(thingid, name, metadata)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}