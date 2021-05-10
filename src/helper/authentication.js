import * as svcThing from '../services/svc-thing'

export const authentication = async (req, res, next) => {
    let token = req.headers.authorization
    let result = await svcThing.getAll(token)
    if(result.status == 200 && result.statusText == "OK"){
        next()
    }
}

export const authenToken = async (token) => {
    let result = await svcThing.getAll(token)
    return result.status == 200 && result.statusText == "OK"
}