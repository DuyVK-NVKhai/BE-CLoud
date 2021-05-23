import {svcRegister, svcLogin, svcChangePassword} from "../services/svc-user"
import {valRegister} from '../helper/validate'
import {sendSuccess, sendError} from "../utils/response"
import * as svcThing from '../services/svc-thing'
import * as things from '../helper/things'
import * as helper from '../helper/common'
import {natClient} from '../app'

export function register(req, res) {
    const {email, password} = req.body
    if(!valRegister(email, password)){
        sendError()
    }
    svcRegister(email, password)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export function login(req, res) {
    const {email, password} = req.body
    if(!valRegister(email, password)){
        sendError()
    }
    svcLogin(email, password)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res))
}

export async function changePassword(req, res) {
    const {oldPassword, password} = req.body
    const token = req.headers.authorization
    if(oldPassword == null || password == null){
        sendError()
    }

    svcChangePassword(oldPassword, password, token)
    .then(async (response) => {
        // let allThing = await svcThing.getAllGateway(token)
        // if(allThing.data.things){
        //     allThing.data.things.forEach(async thing => {
        //         const control_cnl = await things.getControlChannelGtw(thing.id, token)
        //         let payload = helper.objectToBase64({password})
        //         const message = await proto.createMessage(control_cnl, `services/config`, payload)
        //         natClient.forwardNat('channels.config', message)
        //     })
        // }
        sendSuccess(req, res)({status: 200, data: response.msg})
    })
    .catch(sendError(req, res))
}

export function auth(req, res) {
    sendSuccess(req, res)({data: ""})
}