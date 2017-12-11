import * as admin from 'firebase-admin';
import * as firebase from 'firebase';

var serviceAccount = require('../serviceAccountKey.json');

var config = {
    apiKey: " AIzaSyB0C1meQwGnQQdZc-iTFtK4sNjBh6eU0nk ",
    authDomain: "binance-c0c2d.firebaseapp.com",
    databaseURL: "https://binance-c0c2d.firebaseio.com",
    // storageBucket: "bucket.appspot.com"
  }
  

export class FireBaseController {

    regDB: admin.database.Database;
    // regDB: firebase.database.Database;

    constructor(){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://binance-c0c2d.firebaseio.com"
        });

        // firebase.initializeApp({
        //     credential: admin.credential.cert(serviceAccount),
        //     databaseURL: "https://binance-c0c2d.firebaseio.com"
        // })

        this.regDB = admin.database();
        // this.regDB = firebase.database();
    }

    pushToSpecificTable(tableName: string, _content: any, _timestamp: string): Promise<any>{
        // return this.adminDB.ref(tableName).push().set({timestamp: _timestamp, content: _content});
        return this.regDB.ref(tableName).push().set({timestamp: _timestamp, content: _content});
        
    }

    getAllFromSpecificTable(tableName: string): Promise<any> {
        // var _db = this.adminDB;
        var _db = this.regDB;
        

       return new Promise(function(resolve,reject){
           
        var _labels: any = [];
        var _series: any = [];
        var _subSeries: any = [];  

        _db.ref(tableName).once('value',function(snapshot){
            snapshot.forEach(function(childSnapshot) {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
      
              var date = new Date(childData.content.E);
              var day = date.getDay();
              var hour = date.getHours();
              var minute = date.getMinutes();

              var newMinute: string = '';
      
              var nowHour = new Date().getHours();
              
              if(hour > nowHour - 5 && minute%15==0){
                if(minute.toString().length < 2){
                  newMinute = '0'+minute.toString();
                }else{
                    newMinute = minute.toString();
                }
                _labels.push(hour+':'+newMinute);
                _subSeries.push(Math.floor(childData.content.w));
              }

              return false;
            });    
            _series.push(_subSeries);
            resolve({series: _series, labels: _labels, low: Math.min(_subSeries)});
          }).catch((err) => { 
            reject({success: false})
        });
       });
    
    }

}
