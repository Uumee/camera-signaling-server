const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

const peers = [];

server.on('connection', (socket) => {
    peers.push(socket);
    console.log('新しいクライアントが接続しました');

    socket.on('message', (message) => {
        const messageString = message.toString('utf-8'); // Bufferを文字列に変換
        console.log('メッセージを受信:', messageString);
        // 他のすべてのクライアントにメッセージをブロードキャスト
        peers.forEach((peer) => {
            if (peer !== socket && peer.readyState === WebSocket.OPEN) {
                peer.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('クライアントが切断されました');
        const index = peers.indexOf(socket);
        if (index !== -1) {
            peers.splice(index, 1);
        }
    });

    socket.on('error', (error) => {
        console.error('WebSocketエラー:', error);
    });
});

console.log('シグナリングサーバーがポート3000で起動しました');
