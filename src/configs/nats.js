const { connect } = require("nats");

export const createConn = async function(){
    return await connect({ servers: "nats:4222" });
}
