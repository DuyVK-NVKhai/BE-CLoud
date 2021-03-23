
export const getTopic = async function (gatewayId, hassApi, token) {
    const gateway = await svcThing.getThing(gateway_id, token);
    if (!gateway) {
        throw new Error("Not found geteway")
    }
    const control_cnl = gateway.metadata.ctrl_channel_id;
    const extGateway = gateway.metadata.external_key;
    const now = Date.now()
    return {
        subtopicReq: `services/${extGateway}/${now}/hass/methods/this/api`,
        topicRes: `channels/${control_cnl}/messages/export/${extKey}/${now}/hass/${hassApi}`,
        id: gateway.id,
        key: gateway.key
    }
}