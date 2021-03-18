import * as svcThing from "../services/svc-thing"
import {valUpdateInfo} from '../helper/validate'
import {sendSuccess, sendError} from "../helper/response"

export function getAll(req, res) {
    svcThing.getAll()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function createThing(req, res) {
    // const {email, password} = req.body
    // if(!valRegister(email, password)){
    //     sendError()
    // }
    // svcLogin(email, password)
    //     .then(sendSuccess(req, res))
    //     .catch(sendError(req, res))
}

export function updateThingInfo(req, res) {
    const {thingid, name, metadata} = req.body

    if(!valUpdateInfo(thingid, name, metadata)){
        sendError()
    }

    svcThing.updateInfo(thingid, name, metadata)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}