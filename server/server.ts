import * as WebSocket from 'ws';
import { FireBaseController } from './controllers/firebase'
import { error } from 'util';

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// const binanceStream = 'wss://stream.binance.com:9443/ws/btcusdt@kline_5m';
const binanceStream = 'wss://stream.binance.com:9443/ws/btcusdt@ticker';

// const wss = new WebSocket.Server( { server } );
const wss = new WebSocket(binanceStream);

let firebaseCtrl = new FireBaseController();


function pushToFirebase(content: any, timestamp: string){    
    //Get Reference to json object called test in firebase 
    firebaseCtrl.pushToSpecificTable('btcusdt_ticker',content,timestamp).then(function(res: any){
        if(res){
            console.log('SERVER',res);
        }else{
            console.log('SERVER','Pushed content to firebase');
        }
    }).catch(function(err: any){
        console.log('SERVER - FirebaseErr',err);
    });
}

wss.on('error', (err) => {
    console.log('WSS', err);
});

wss.on('open', function open(){

    console.log('WSS', `Connected to ${binanceStream}`);

    //connection is up, let's add a simple simple event
    wss.on('message', function incoming(message) {

        // console.log(`WS ${Date.now()} - received: %s`);         

        var minute = new Date().getMinutes();  
        var second = new Date().getSeconds();      

        let content = JSON.parse(message.toString());

        if((minute%5==0 && second%30==0) || (minute == 0 && second%30==0)){
            pushToFirebase(content,Date.now().toString());
        }

    });
});

const express = require('express');

var app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/crypto',express.static('./dist/public'));

app.get('/services/binance/all', function(req: any,res: any){
    firebaseCtrl.getAllFromSpecificTable('btcusdt_ticker').then((data) => {
        res.send(data);
    })
});

app.listen(3000, () => console.log('Express server listening on port 3000'));