import * as svcThing from '../services/svc-thing'

export const getExtKeyThing = async function(id, token){
    try{
        const thing = await svcThing.getThing(id, token)
        if(thing){
            return thing.metadata.external_key
        }
    }catch(e){
        throw new Error(e)
    }
}

export const getInfoGateway = async function (gatewayId, hassApi, token) {
    try{
        const gateway = await svcThing.getThing(gatewayId, token);
        if (!gateway) {
            throw new Error("Not found geteway")
        }
        const control_cnl = gateway.metadata.ctrl_channel_id;
        return {
            id: gateway.id,
            control_cnl
        }
    }catch(e){
        // console.log(e)
        throw e
    }
}