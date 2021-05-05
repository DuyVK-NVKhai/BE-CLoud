var WebSocketServer = require('websocket').server;

export const createWbs = (server) => {
    let wsClient = []

    let wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });
    
    wsServer.on('request', function(request) {
        var connection = request.accept('echo-protocol', request.origin);
        if(request.resourceURL.pathname){
            let clientId = request.resourceURL.pathname.substring(1)
            wsClient[clientId] = connection
        }
    });
    return {wsServer, wsClient}    
}