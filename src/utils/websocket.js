var WebSocketServer = require('websocket').server;
var {authenToken} = require('../helper/authentication')

export const createWbs = (server) => {
    let wsClient = []

    let wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });
    
    wsServer.on('request', function(request) {
        var connection = request.accept('echo-protocol', request.origin);
        if(request.resourceURL.pathname){
            let params = request.resourceURL.pathname.substring(1)
            let arr = params.split("/")
            console.log({arr})
            if(arr.length >= 2 && authenToken(arr[1])){
                wsClient[arr[0]] = connection
            }else{
                connection.sendUTF(JSON.stringify({
                    result: false,
                    message: "Authen failed"
                }))
            }
        }
    });
    return {wsServer, wsClient}    
}