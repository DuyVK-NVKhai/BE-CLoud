const axios = require('axios').default;

export async function svcRegister(email, password){
    const result = await axios({
        method: 'post',
        url: 'http://localhost/users',
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
        url: 'http://localhost',
    })
    return result
}
