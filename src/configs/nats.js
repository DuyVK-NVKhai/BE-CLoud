const { connect } = require("nats");

export const createConn = async function(){
    return await connect({ servers: "localhost:4222" });
}
