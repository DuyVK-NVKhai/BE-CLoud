import {createConn} from '../configs/nats'
import {StringCodec} from "nats"

export const forwardNat = async function(topic, msg){
    // connect NAT
    // nc = await createConn()
    const sc = StringCodec();
    const nc = await createConn()
    nc.publish(topic, sc.encode(msg));
}