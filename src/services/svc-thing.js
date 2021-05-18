import axios from '../configs/axios'
import {url as URL} from '../configs/common'

export async function getAllGateway(token, params){
    return await axios({
        method: 'get',
        url: '/things',
        params,
        headers: {
            "Authorization": token
        }
    })
}

export async function getByGateway(token, gatewayId){
    let gateway = await svcGetGtw(token, gatewayId)
    if(gateway == null){
        return 
    }
    let controlChannel = gateway.metadata.ctrl_channel_id
    const result = await axios({
        method: 'get',
        url: `/channels/${controlChannel}/things`,
        headers: {
            "Authorization": token
        }
    })
    return {
        data: result.data.things
    }
}

export async function getGatewayByChannel(controlChannel, token){
    let result = await svcGetGtw(token)
    let allThing = result.data
    for(let i = 0; i < allThing.length; i++){
        if(allThing[i].metadata.ctrl_channel_id == controlChannel){
            return allThing[i]
        }
    }
}

export async function getThing(id, token){
    const result = await axios({
        method: 'get',
        url: `/things/${id}`,
        headers: {
            "Authorization": token
        }
    })
    return result.data
}

export async function svcCreate(name, extKey, data, token){
    const result = await axios({
        method: 'post',
        url: '/things',
        headers: {
            "Authorization": token
        },
        data: {
            name: name,
            key: extKey,
            metadata: data
        }
    })
    return result
}

export async function svcGetGtw(token, id = ""){
    let url = "/things"
    if(id.length > 0){
        url += `/${id}`
    }
    const result = await axios({
        method: 'get',
        url,
        params: {
            limit: 100,
            offset: 0
        },
        headers: {
            "Authorization": token
        },
    })

    if(id == ""){
        let listgateway = []
        result.data.things.forEach((thing) => {
            if(thing.metadata && thing.metadata.type == "gateway"){
                listgateway.push(thing)
            }
        })
        return {
            data: listgateway    
        }
    }
    return result.data
}

export async function svcCreateGtw(id, key, name, token){
    const result = await axios({
        method: 'post',
        url: '/mapping',
        baseURL: URL.PROVISION_URL,
        headers: {
            "Authorization": token
        },
        data: {
            "external_id": id,
            "external_key": key,
            name
        }
    })
    if(result.status == 200 || result.status == 201){
        return {
            success: result.success
        }
    }
    return result
}

export async function getControlChannelGtw(gatewayId, token) {
    try{
        const gateway = await svcThing.getThing(gatewayId, token);
        if (!gateway) {
            throw new Error("Not found geteway")
        }
        return gateway.metadata.ctrl_channel_id;
    }catch(e){
        throw e
    }
}