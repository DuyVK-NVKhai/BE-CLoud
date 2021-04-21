export const createSub = function(mqttClient, topic){
    return mqttClient.subscribe(topic)
}

export const subscribe = async function(mqttConn, topicParam, username="", password=""){
    const sub = await createSub(mqttConn, topicParam, username, password)
    return new Promise((resolve, reject) => {
        sub.on('message',function (topic, payload, packet) {
            if (payload) {
              sub.unsubscribe(topic)
              resolve(payload)
            }
            sub.unsubscribe(topic)
            reject()
        })
    })
}
