const common = {
    AUTHEN_FAILED: "Tài khoản hoặc mật khẩu không chính xác"
}

export const url = {
    PROVISION_URL: process.env.PROVISION_URL || "http://provision:8190"
}

export const hassApi = {
    SCAN_DEVICE: "get/scan/device/around",
    ADD_DEVICE: "post/add/device",
    DELETE_DEVICE: "delete/device"
}

export const MQTT_URL = 'mqtt://nginx:1883'

export default common;