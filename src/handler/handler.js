import {svcLogin} from '../services/svc-user'
import {wsClient} from '../app'
import * as svcThing from '../services/svc-thing'

export const handleData = async function(channels, messageNat) {
    try{
        let channelCtl = getChannelCtl(channels)        
        let dataObj = JSON.parse(messageNat)
        let {action} = dataObj
        if(dataObj.data != null) {
            let data = JSON.parse(dataObj.data)
            if(wsClient[channelCtl] != null)
            {
                wsClient[channelCtl].forEach(sckConn => {
                    sckConn.sendUTF(JSON.stringify({
                        data, action
                    }))
                });
            }
        }
    }catch(e){
        console.log(e)
    }
}

export function getChannelCtl (natChannels) {
    let arr = natChannels.split(".")
    return arr[1]
}
