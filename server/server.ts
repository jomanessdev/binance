import * as WebSocket from 'ws';
import { FireBaseController } from './controllers/firebase'
import { error } from 'util';
import { WSAEINVALIDPROVIDER } from 'constants';

var environment = require('./env.json')

var os = require('os');

const REFRESH_INTERVAL: number = 10; //in minutes

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// const binanceStream = 'wss://stream.binance.com:9443/ws/btcusdt@kline_5m';
const bitcoinBinanceStream = 'wss://stream.binance.com:9443/ws/btcusdt@ticker';
const litecoinBinanceStream = 'wss://stream.binance.com:9443/ws/ltcbtc@ticker';
const iotaBinanceStream = 'wss://stream.binance.com:9443/ws/iotabtc@ticker';



// const wss = new WebSocket.Server( { server } );
const btcwss = new WebSocket(bitcoinBinanceStream);
const ltcwss = new WebSocket(litecoinBinanceStream);
const iotawss = new WebSocket(iotaBinanceStream);


let firebaseCtrl = new FireBaseController();


function pushToFirebase(tableName: string, content: any, timestamp: string){    
    //Get Reference to json object called test in firebase 
    firebaseCtrl.pushToSpecificTable(tableName,content,timestamp).then(function(res: any){
        if(res){
            console.log('SERVER',res);
        }else{
            console.log('SERVER','Pushed content to firebase');
        }
    }).catch(function(err: any){
        console.log('SERVER - FirebaseErr',err);
    });
}

btcwss.on('error', (err) => {
    console.log('WSS', err);
});

btcwss.on('open', function open(){

    console.log('WSS', `Connected to ${bitcoinBinanceStream}`);

    //connection is up, let's add a simple simple event
    btcwss.on('message', function incoming(message) {

        // console.log(`WS ${Date.now()} - received: %s`);         

        var minute = new Date().getMinutes();  
        var second = new Date().getSeconds();      

        let content = JSON.parse(message.toString());

        if((minute%REFRESH_INTERVAL==0 && second%30==0) || (minute == 0 && second%30==0)){
            pushToFirebase('btcusdt_ticker',content,Date.now().toString());
        }

    });
});


ltcwss.on('error', (err) => {
    console.log('WSS', err);
});

ltcwss.on('open', function open(){

    console.log('WSS', `Connected to ${litecoinBinanceStream}`);

    //connection is up, let's add a simple simple event
    btcwss.on('message', function incoming(message) {

        // console.log(`WS ${Date.now()} - received: %s`);         

        var minute = new Date().getMinutes();  
        var second = new Date().getSeconds();      

        let content = JSON.parse(message.toString());

        if((minute%REFRESH_INTERVAL==0 && second%30==0) || (minute == 0 && second%30==0)){
            pushToFirebase('ltcbtc_ticker',content,Date.now().toString());
        }

    });
});

iotawss.on('error', (err) => {
    console.log('WSS', err);
});

iotawss.on('open', function open(){

    console.log('WSS', `Connected to ${iotaBinanceStream}`);

    //connection is up, let's add a simple simple event
    iotawss.on('message', function incoming(message) {

        // console.log(`WS ${Date.now()} - received: %s`);         

        var minute = new Date().getMinutes();  
        var second = new Date().getSeconds();      

        let content = JSON.parse(message.toString());

        if((minute%REFRESH_INTERVAL==0 && second%30==0) || (minute == 0 && second%30==0)){
            pushToFirebase('iotabtc_ticker',content,Date.now().toString());
        }

    });
});

const express = require('express');

var app = express();

if(environment.testEnv == false){
    app.use(cors({origin: `http://${os.hostname()}:${environment.port}`}));    
}else{
    app.use(cors());

}

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/crypto',express.static('./dist/public'));

app.get('/services/binance/btc', function(req: any,res: any){

    var limit = parseInt(req.query.limit);
    if(limit){
        firebaseCtrl.getAllFromSpecificTableLimit('btcusdt_ticker',limit).then((data) => {
            res.send(data);
        });
    }else{
        firebaseCtrl.getAllFromSpecificTable('btcusdt_ticker').then((data) => {
            res.send(data);
        })
    }
    
});

app.get('/services/binance/ltc', function(req: any,res: any){

    var limit = parseInt(req.query.limit);
    if(limit){
        firebaseCtrl.getAllFromSpecificTableLimit('ltcbtc_ticker',limit).then((data) => {
            res.send(data);
        });
    }else{
        firebaseCtrl.getAllFromSpecificTable('ltcbtc_ticker').then((data) => {
            res.send(data);
        })
    }
});

app.get('/services/binance/iota', function(req: any,res: any){

    var limit = parseInt(req.query.limit);

    if(limit){
        firebaseCtrl.getAllFromSpecificTableLimit('iotabtc_ticker',limit).then((data) => {
            res.send(data);
        });
    }else{
        firebaseCtrl.getAllFromSpecificTable('iotabtc_ticker').then((data) => {
            res.send(data);
        })
    }
});

app.listen(environment.port, () => console.log(`Express server listening on port ${environment.port}`));
