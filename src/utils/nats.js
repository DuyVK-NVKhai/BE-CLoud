const { connect, StringCodec } = require("nats");
import {handleData} from '../handler/handler'
import * as common from '../helper/common'
import * as proto from './protobuf'
const sc = StringCodec();
export const natClient = () => {
  var nc = null

  const forwardNat = async function (topic, msg) {
    try{
      if(!nc){
        nc = await createConn()
      }
      nc.publish(topic, msg);
    }catch(e){
      console.log(e)
    }
  }

  const subscribe = async function(channel, handler) {
    if(!nc)
    {
        nc = await createConn()
    }
    const sub = nc.subscribe(channel);
    (async () => {
        for await (const m of sub) {
            await handler(m)
        }
        console.log("subscription closed");
    })();
  }
  
  return {
    nc,
    forwardNat,
    subscribe
  }
}

export const handleRealtime = async function(msgNat) {
  let msg = await decodeMessageNat(msgNat.data)
  await handleData(msgNat.subject, msg)
}

export const createConn = async () => connect({ servers: "nats:4222" })

export const getTopic = (control_cnl) => `channels.${control_cnl}.>`

export const getChnlRealtime = () => "channels.*.*.gateway.socket.*"

export const decodeMessageNat = async function (mes) {
  try{
    let msgPtb = await proto.decodeMessage(mes)
    let data = common.bin2string(msgPtb.getPayload()).replace(/\0/g, '')
    console.log({data})
    return data
  }catch(e){
    console.log({e})
  }
}