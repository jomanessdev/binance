import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { FireBaseController } from './controllers/firebase';

const app = express();

const server = http.createServer(app);

const binanceStream = 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m';

// const wss = new WebSocket.Server( { server } );
const wss = new WebSocket(binanceStream);

wss.on('connection', (ws: WebSocket) => {

    let firebaseCtrl = new FireBaseController();
    
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        
        //Get Reference to json object called test in firebase 
        firebaseCtrl.pushToSpecificTable('test',message,'').then(function(res: any){
            console.log('FIREBASE',res);

        }).catch(function(err: any){
            console.log('FIREBASE',err);
        });

        //log the received message and send it back to the client
        console.log('received: %s', message);
    });
});

server.listen(8080,() => {
    console.log(`Server started on port ${server.address().port} :)`);    
});