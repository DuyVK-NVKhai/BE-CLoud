const protobuf = require('protobufjs');

export const encodeProtob = async function(msg, filePtb, type){
    const root = await protobuf.load(filePtb);
    const User = root.lookupType(type);
    return User.encode(msg).finish();
}