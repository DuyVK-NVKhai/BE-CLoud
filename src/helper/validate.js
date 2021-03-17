export const valRegister = (email, password) => {
    return email != null && password != null && email != "" && password != ""
}

export const valUpdateInfo = (thingId, name, metadata) => {
    return thingId != null && name != null && metadata != null && thingId != "" && name != "" && metadata != "" 
}
