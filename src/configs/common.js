const common = {
    AUTHEN_FAILED: "Tài khoản hoặc mật khẩu không chính xác"
}

export const url = {
    PROVISION_URL: process.env.PROVISION_URL || "http://provision:8190"
}

export const hassApi = {
    SCAN_DEVICE: "get_states",
    SERVICE: "call_service",
    ADD_DEVICE: "post/add/device",
    DELETE_DEVICE: "delete/device",
    CONFIG: "config"
}

export const config = {
    port: process.env.PORT || 3000
}

export default common;