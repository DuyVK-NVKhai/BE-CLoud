import axios from '../configs/axios'
import {forwardNat} from '../helper/forwardNat'

export async function getAll(){
    const result = await axios({
        method: 'get',
        url: '/things',
    })
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
