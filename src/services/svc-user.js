import axios from '../configs/axios'

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
    return result
}
