const { connect, StringCodec } = require("nats");
import { encodeProtob } from "../helper/protobuf"

export const createConn = async function(){
    return await connect({ servers: "nats:4222" });
}

export const getTopic = function(control_cnl){
  return `channels.${control_cnl}`
}

export const forwardNat = async function(topic, msg){
    const msgPtb = await encodeProtob(msg, '/app/src/msg_protobuf/message.proto', 'messaging.Message')
    const sc = StringCodec();
    const nc = await createConn()
    nc.publish(topic, sc.encode(msgPtb));
}

export const subscribeNat = async function(topic){
    const nc = await createConn()
    const sub = nc.subscribe(topic)
    handleRequest(sub)
}

async function handleRequest(s) {
    console.log("Begin subscribe nat")
    for await (const m of s) {
      // respond returns true if the message had a reply subject, thus it could respond
      if (m.respond(m.data)) {
        console.log(
          `#${s.getProcessed()} echoed ${sc.decode(m.data)}`,
        );
      } else {
        console.log(
          `#${s.getProcessed()} ignoring request - no reply subject`,
        );
      }
    }
  }