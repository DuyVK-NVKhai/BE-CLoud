import * as svcThing from '../services/svc-thing'

export const authentication = async (req, res, next) => {
    let token = req.headers.authorization
    await svcThing.getAllGateway(token)
    .then(() => {
        next();
    })
    .catch(e => {
        res.status(401).send({
            message: "Unauthorized",
            success: false
        })
    })
}

export const authenToken = async (token) => {
    let result = await svcThing.getAllGateway(token)
    return result.status == 200 && result.statusText == "OK"
}