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
    forwardNat("test", {
        id, name, metadata
    })
    const result = await axios({
        method: 'put',
        url: `/things/${id}`,
        data: {
            name,
            metadata
        }
    })
    return result
}
