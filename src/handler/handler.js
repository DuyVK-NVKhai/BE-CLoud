import {svcLogin} from '../services/svc-user'
import {wsClient} from '../app'
import * as svcThing from '../services/svc-thing'

export const handleData = async function(channels, messageNat) {
    try{
        let channelCtl = getChannelCtl(channels)        
        let dataObj = JSON.parse(messageNat)
        let {username, password, action} = dataObj
        let data = JSON.parse(dataObj.data)

        let result = await svcLogin(username, password)
        let {token} = result.data
        
        let gateway = await svcThing.getGatewayByChannel(channelCtl, token)
        if(gateway && wsClient[gateway.id]){
            wsClient[gateway.id].sendUTF(JSON.stringify({
                data, action
            }))
        }
    }catch(e){
        console.log(e)
    }
}

export function getChannelCtl (natChannels) {
    let arr = natChannels.split(".")
    return arr[1]
}
