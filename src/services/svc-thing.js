import axios from '../configs/axios'
import {forwardNat} from '../configs/nats'
import {url as URL} from '../configs/common'

export async function getAll(token){
    const result = await axios({
        method: 'get',
        url: '/things',
        headers: {
            "Authorization": token
        }
    })
    return result
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

export async function svcCreate(name, extKey, token){
    const result = await axios({
        method: 'post',
        url: '/things',
        headers: {
            "Authorization": token
        },
        data: {
            name: name,
            key: extKey
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

export async function getThingByEntity(entity_id, controlChannel, token){
    const result = await axios({
        method: 'get',
        url: `/channels/${controlChannel}/things`,
        headers: {
            "Authorization": token
        }
    })
    let thingId
    result.data.things.forEach((thing) => {
        if(thing.metadata.entity_id == entity_id){
            thingId = thing.id
        }
    })
    return thingId
}

export async function updateThing(id, data, token){
    try{
        let resultGetAllThings = await axios({
            method: 'put',
            url: `/things/${id}`,
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            data
        })
        return resultGetAllThings;
    }catch(e){
        console.log(e)
    }
}

export async function updateInfo(id, name, metadata, token){
    let resultGetAllThings = await axios({
        method: 'put',
        url: `/things?ThingId=${id}`,
        headers: {
            "Authorization": token
        },
        data: {
            metadata
        }
    })

    let result
    if(resultGetAllThings.total > 0){
        let listControlChannel = []
        resultGetAllThings.things.foreach((thing) => {
            if(thing.metadata && thing.metadata.type == "gateway"){
                listControlChannel.push(things.metadata.ctrl_channel_id)
            }
        })
        
        listControlChannel.foreach(chnl => {
            metadata = Object.assign(metadata, {Channel: chnl})
            forwardNat("channels.updateNat", {
                id, name, metadata
            })
        })
        result = await axios({
            method: 'put',
            url: `/things/${id}`,
            data: {
                name,
                metadata
            }
        })
    }
    return result
}
