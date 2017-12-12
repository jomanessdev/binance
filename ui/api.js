
var _labels = [];
var _series = [];
var _subSeries = [];


var environment; 
var serverUrl;


var btcLineChart = new Chartist.Line('#chart1', {
  labels: _labels,
  series: _series
});

var ltcLineChart = new Chartist.Line('#chart2', {
  labels: _labels,
  series: _series
});

var iotaLineChart = new Chartist.Line('#chart3', {
    labels: _labels,
    series: _series
  });

var getEnv = new Promise(function(resolve, reject){
    var xmlhttpEnv = new XMLHttpRequest();
    
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xmlhttpEnv = new XMLHttpRequest();
         } else {
            // code for old IE browsers
            xmlhttpEnv = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        xmlhttpEnv.onreadystatechange = function() {        
            if (this.readyState == 4 && this.status == 200) {
                let jsonResp = JSON.parse(xmlhttpEnv.responseText);
                resolve(jsonResp);
            }
        };

        xmlhttpEnv.onerror = function(){
            reject(this.statusText);
        }

        xmlhttpEnv.overrideMimeType("application/json");
        xmlhttpEnv.open("GET", 'env.json', true);
        xmlhttpEnv.send();
});


function refreshBtc(limit){

    var _labels = [];
    var _series = [];
    var _subSeries = [];

    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } 

    xmlhttp.onreadystatechange = function() {        
        if (this.readyState == 4 && this.status == 200) {
            
           // Typical action to be performed when the document is ready:
           let jsonResp = JSON.parse(xmlhttp.responseText);

           _labels = jsonResp.labels;
           _series = jsonResp.series;
           _low = jsonResp.low;

           btcLineChart.update({series: _series, labels: _labels},{low: _low, showArea: true, showLine:true, showPoint:true});
        }
    };
    if(limit){
        xmlhttp.open("GET", serverUrl+`/binance/btc?limit=${limit}`, true);                
    }else{
        xmlhttp.open("GET", serverUrl+'/binance/btc', true);        
    }
    xmlhttp.send();
}


function refreshLtc(limit){

    var _labelsLtc = [];
    var _seriesLtc = [];
    var _subSeriesLtc = [];

    var xmlhttpLtc;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttpLtc = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        xmlhttpLtc = new ActiveXObject("Microsoft.XMLHTTP");
    } 

    xmlhttpLtc.onreadystatechange = function() {        
        if (this.readyState == 4 && this.status == 200) {
            
           // Typical action to be performed when the document is ready:
           let jsonResp = JSON.parse(xmlhttpLtc.responseText);

           _labelsLtc = jsonResp.labels;
           _seriesLtc = jsonResp.series;
           _low = jsonResp.low;

           ltcLineChart.update({series: _seriesLtc, labels: _labelsLtc},{low: _low, showArea: true, showLine:true, showPoint:true});
        }
    };

    if(limit){
        xmlhttpLtc.open("GET", serverUrl+`/binance/ltc?limit=${limit}`, true);      
    }else{
        xmlhttpLtc.open("GET", serverUrl+'/binance/ltc', true);        
    }
    xmlhttpLtc.send();
}

function refreshIota(limit){
    
        var _labelsIota = [];
        var _seriesIota = [];
        var _subSeriesIota = [];
    
        var xmlhttpIota;
    
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xmlhttpIota = new XMLHttpRequest();
         } else {
            // code for old IE browsers
            xmlhttpIota = new ActiveXObject("Microsoft.XMLHTTP");
        } 
    
        xmlhttpIota.onreadystatechange = function() {        
            if (this.readyState == 4 && this.status == 200) {
                
               // Typical action to be performed when the document is ready:
               let jsonResp = JSON.parse(xmlhttpIota.responseText);
    
               _labelsIota = jsonResp.labels;
               _seriesIota = jsonResp.series;
               _low = jsonResp.low;
    
               iotaLineChart.update({series: _seriesIota, labels: _labelsIota},{low: _low, showArea: true, showLine:true, showPoint:true});
            }
        };
    
        if(limit){
            xmlhttpIota.open("GET", serverUrl+`/binance/iota?limit=${limit}`, true);      
            
        }else{
            xmlhttpIota.open("GET", serverUrl+'/binance/iota', true);            
        }
        xmlhttpIota.send();
    }

getEnv.then(function(result){
    environment = result;

    if(environment.testEnv == false){
        serverUrl = `http://${window.location.hostname}:${environment.port}/services`;
        
    }else{
        serverUrl = `http://localhost:${environment.port}/services`;
    }

    refreshBtc();
    refreshLtc();
    refreshIota();

}).catch(function(err){
    console.log('Error', err);
});

function refreshAll(){
    var limit = parseInt(document.getElementById("limitInput").value);

    if(!limit || limit < 1){
        refreshBtc();
        refreshLtc();
        refreshIota();
    }else{
        refreshBtc(limit);
        refreshLtc(limit);
        refreshIota(limit);
    }

}


