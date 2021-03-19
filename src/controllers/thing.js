import * as svcThing from "../services/svc-thing"
import {valUpdateInfo} from '../helper/validate'
import {sendSuccess, sendError} from "../helper/response"

export function getAll(req, res) {
    const token = req.headers.authorization
    svcThing.getAll(token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function createGateway(req, res) {
    const token = req.headers.authorization
    const {id, key} = req.body
    if(id == null || id == "" || key == null || key == ""){
        sendError(req, res)
    }
    svcThing.svcCreateGtw(id, key, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function createThing(req, res) {
    const token = req.headers.authorization
    let {name} = req
    svcThing.svcCreate(name, token)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function updateThingInfo(req, res) {
    const {thingid, name, metadata} = req.body

    if(!valUpdateInfo(thingid, name, metadata)){
        sendError(req, res)
    }

    svcThing.updateInfo(thingid, name, metadata)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}