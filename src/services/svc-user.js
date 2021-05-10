import axios from '../configs/axios'
import {getAll} from './svc-thing'

export async function svcRegister(email, password){
    const result = await axios({
        method: 'post',
        url: '/users',
        data: {
            email: email,
            password: password
        },
    })
    return result
}

export async function svcLogin(email, password){
    const result = await axios({
        method: 'post',
        url: '/tokens',
        data: {
            email: email,
            password: password
        },
    })
    result.data.username = email
    return result
}
