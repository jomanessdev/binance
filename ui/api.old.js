
var _labels = [];
var _series = [];
var _subSeries = [];

var serverUrl = 'http://localhost:3000/services'

var config = {
  apiKey: " AIzaSyB0C1meQwGnQQdZc-iTFtK4sNjBh6eU0nk ",
  authDomain: "binance-c0c2d.firebaseapp.com",
  databaseURL: "https://binance-c0c2d.firebaseio.com",
  // storageBucket: "bucket.appspot.com"
}

firebase.initializeApp(config);  

var lineChart = new Chartist.Line('#chart1', {
  labels: _labels,
  series: _series
}, {
  low: 0,
  showArea: true
});

var barChart = new Chartist.Bar('#chart2', {
  labels: _labels,
  series: _series
});

refresh();


function refresh(){
  
  var database = firebase.database(); 
    var _labels = [];
    var _series = [];
    var _subSeries = [];

    database.ref('btcusdt_ticker').once('value',function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        var date = new Date(childData.content.E);
        var day = date.getDay();
        var hour = date.getHours();
        var minute = date.getMinutes();

        var nowHour = new Date().getHours();
        
        if(hour > nowHour - 5 && minute%15==0){
          if(minute.toString().length < 2){
            minute = '0'+minute.toString();
          }
          _labels.push(hour+':'+minute);
          _subSeries.push(Math.floor(childData.content.w));
        }
      });    
      _series.push(_subSeries);
      lineChart.update({series: _series, labels: _labels});
      barChart.update({series: _series, labels: _labels});
    });
}

