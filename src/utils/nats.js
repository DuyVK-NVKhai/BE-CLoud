const { connect, StringCodec } = require("nats");
import { protoTool } from "../helper/protobuf"
import {handleData} from '../handler/handler'
const sc = StringCodec();
const _protoTool = protoTool()
export const natClient = () => {
  var nc = null

  const forwardNat = async function (topic, msg) {
    try{
      if(!nc){
        nc = await createConn()
      }
      const msgPtb = await _protoTool.encodeProtob(msg)
      nc.publish(topic, sc.encode(msgPtb));
    }catch(e){
      console.log(e)
    }
  }

  const subscribe = async function(channel, handler) {
    if(!nc)
    {
        nc = await nats.createConn()
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

export const getChnlRealtime = () => "channels.*.*.gateway"

const decodeMessageNat = async function (mes) {
  let msgPtb = await _protoTool.decodeProtob(mes)
  var dataNat = msgPtb.payload.toString('utf8').replace(/\0/g, '')
  return dataNat
}