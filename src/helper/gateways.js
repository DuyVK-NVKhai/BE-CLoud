import * as svcThing from '../services/svc-thing'

export const getTopic = async function (gatewayId, hassApi, token) {
    try{
        const gateway = await svcThing.getThing(gatewayId, token);
        if (!gateway) {
            throw new Error("Not found geteway")
        }
        const control_cnl = gateway.metadata.ctrl_channel_id;
        const extGateway = gateway.metadata.external_key;
        const now = Date.now()
        return {
            subtopicReq: `services/${extGateway}/${now}/hass/${hassApi}`,
            topicRes: `channels/${control_cnl}/messages/export/${extGateway}/${now}/hass/${hassApi}`,
            id: gateway.id,
            key: gateway.key,
            control_cnl
        }
    }catch(e){
        console.log(e)
        throw e
    }
}