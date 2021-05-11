const Schema = require('../protobuf/message_pb')

export const createMessage = async (channel, topic, payload)=>{
    const message = new Schema.Message()
    message.setChannel(channel)
    message.setSubtopic(topic)
    message.setPayload(payload)
    return message.serializeBinary()
}

export const decodeMessage = async (mes) => {
    let msgPtb = await Schema.Message.deserializeBinary(mes)
    return msgPtb
}