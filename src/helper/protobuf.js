const protobuf = require('protobufjs');

export const protoTool = () => {
    let filePtb = '/app/src/protobuf/message.proto'
    let type = 'messaging.Message'
    let encodeProtob = async function(msg){
        const root = await protobuf.load(filePtb);
        const User = root.lookupType(type);
        return User.encode(msg).finish();
    }

    let decodeProtob = async function(buffer){
        const root = await protobuf.load(filePtb);
        const User = root.lookupType(type);
        return User.decode(buffer);
    }

    return {
        encodeProtob,
        decodeProtob
    }
}