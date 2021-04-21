const { connect, StringCodec } = require("nats");
import { encodeProtob } from "../helper/protobuf"
const sc = StringCodec();

export const natClient = async () => {
  var nc = await createConn()

  const forwardNat = async function (topic, msg) {
    setTimeout(async () => {
      const msgPtb = await encodeProtob(msg, '/app/src/msg_protobuf/message.proto', 'messaging.Message')
      nc.publish(topic, sc.encode(msgPtb));
    }, 100)
  }
  
  const subscribeNat = async function (topic) {
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
      resolve(sc.decode(m.data))
    }
  })
}

export const getTopic = function (control_cnl) {
  return `channels.${control_cnl}`
}