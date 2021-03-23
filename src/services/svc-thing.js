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

export async function svcCreateGtw(id, key, token){
    const result = await axios({
        method: 'post',
        url: '/mapping',
        baseURL: URL.PROVISION_URL,
        headers: {
            "Authorization": token
        },
        data: {
            "external_id": id,
            "external_key": key
        }
    })
    if(result.status == 200 || result.status == 201){
        return {
            success: result.success
        }
    }
    return result
}

export async function updateInfo(id, name, metadata){
    let resultGetAllThings = await axios({
        method: 'get',
        url: `/things`,
        data: {
            name,
            metadata
        }
    })

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
        const result = await axios({
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
