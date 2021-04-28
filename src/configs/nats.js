const { connect, StringCodec } = require("nats");
import { bin2string } from "../helper/common";
import { protoTool } from "../helper/protobuf"
const sc = StringCodec();
const _protoTool = protoTool()
export const natClient = () => {
  var nc = null

  const forwardNat = async function (topic, msg) {
    if(!nc){
      nc = await createConn()
    }
    setTimeout(async () => {
      const msgPtb = await _protoTool.encodeProtob(msg)
      nc.publish(topic, sc.encode(msgPtb));
    }, 100)
  }
  
  const subscribeNat = async function (topic) {
    if(!nc){
      nc = await createConn()
    }
    const sub = await nc.subscribe(topic)
    let result = await handleRequest(sub)
    return result
  }
  
  return {
    forwardNat,
    subscribeNat
  }
}

const createConn = async function () {
  return connect({ servers: "nats:4222" });
}

async function handleRequest(s) {
  return new Promise(async (resolve, reject) => {
    for await (const m of s) {
      const msgPtb = await _protoTool.decodeProtob(m.data)
      var dataNat = msgPtb.payload.toString('utf8').replace(/\0/g, '')
      console.log(dataNat)
      resolve(dataNat)
    }
  })
}

export const getTopic = function (control_cnl) {
  return `channels.${control_cnl}.>`
}