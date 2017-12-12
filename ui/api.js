
var _labels = [];
var _series = [];
var _subSeries = [];

var serverUrl = `http://${window.location.hostname}:3000/services`;
// var serverUrl = `http://localhost:3000/services`;


var btcLineChart = new Chartist.Line('#chart1', {
  labels: _labels,
  series: _series
});

var ltcLineChart = new Chartist.Line('#chart2', {
  labels: _labels,
  series: _series
});

refreshBtc();
refreshLtc();


function refreshBtc(){

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
    xmlhttp.open("GET", serverUrl+'/binance/btc/all', true);
    xmlhttp.send();

}


function refreshLtc(){

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

    xmlhttpLtc.open("GET", serverUrl+'/binance/ltc/all', true);
    xmlhttpLtc.send();

}
