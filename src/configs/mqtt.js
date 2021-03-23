import mqtt from 'mqtt' 
import {MQTT_URL} from "../configs/common"

export const createSub = function(topic, username="", password=""){
    const mqttCli = mqtt.connect(MQTT_URL, {
        username: username,
        password: password
    })
    const sub = mqttCli.subscribe(topic, {
        username: username,
        password: password
    })
    return sub
}

export const subscribe = function(topicParam, username="", password=""){
    const sub = createSub(topicParam, username, password)
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
