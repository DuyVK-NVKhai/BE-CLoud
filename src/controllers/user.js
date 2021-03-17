import {svcRegister, svcLogin} from "../services/svc-user"
import {valRegister} from '../helper/validate'
import {sendSuccess, sendError} from "../helper/response"

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