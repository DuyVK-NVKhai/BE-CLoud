import axios from '../configs/axios'
import {forwardNat} from '../utils/nats'
import {url as URL} from '../configs/common'
import { createThing } from '../controllers/thing'

export async function getAll(token, params){
    const result = await axios({
        method: 'get',
        url: '/things',
        params,
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

export async function getThingByGateway(controlChannel, token){
    const result = await axios({
        method: 'get',
        url: `/channels/${controlChannel}/things`,
        headers: {
            "Authorization": token
        }
    })
    return result.data.things
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
}

export async function svcDisable(thingId, token) {
    await axios({
        method: 'delete',
        url: `/things/${thingId}`,
        headers: {
            "Authorization": token
        },
    })
}

export async function connectThingToChannel(thingids, channels, token)
{
    let result = await axios({
        method: 'post',
        url: `/connect`,
        headers: {
            "Authorization": token
        },
        data: {
            channel_ids: channels,
            thing_ids: thingids
        }
    })
}

export async function addThingToGateway(channelCtl, data, token) {
    let key = "key-" + Date.now()
    let name = "name-" + Date.now()
    await svcCreate(name, key, data, token)
    let result = await getAll(token, {
        offset: 0,
        limit: 10,
        name
    })
    let allThing = result.data.things
    let listThingNew = [allThing[0].id]
    let listChannel = [channelCtl]    
    await connectThingToChannel(listThingNew, listChannel, token)
}
