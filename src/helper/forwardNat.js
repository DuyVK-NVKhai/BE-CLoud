import {createConn} from '../configs/nats'
import {StringCodec} from "nats"

export const forwardNat = async function(topic, msg){
    const sc = StringCodec();
    const nc = await createConn()
    nc.publish(topic, sc.encode(msg));
}