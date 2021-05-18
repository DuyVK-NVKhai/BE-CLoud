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
        
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            
            for (const [key, value] of Object.entries(wsClient)) {
                let index = value.findIndex(m => m == connection)
                if(index >= 0){
                    value.splice(index, 1)
                }
            }
        });

        if(request.resourceURL.pathname){
            let params = request.resourceURL.pathname.substring(1)
            let arr = params.split("/")
            if(arr.length >= 2 && authenToken(arr[1])){
                wsClient[arr[0]].push(connection)
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