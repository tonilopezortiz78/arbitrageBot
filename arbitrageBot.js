let ws= new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
let ws_satangPro= new WebSocket('wss://ws.satangcorp.com/ws/btc_thb@aggTrade');
let webPriceElement = document.getElementById("webPrice");
let lastPrice= null;
var options = { hour12: false, hour:"numeric", minute:"numeric" ,fractionalSecondDigits: 3 };
var text = "";
var count=0;

ws.onmessage = (event) => {
    count ++;
    let stockObject = JSON.parse(event.data);
    console.log(stockObject);
    let timeStamp = new Date (stockObject.T).toLocaleTimeString('eu',options);
    let price = parseFloat(stockObject.p).toFixed(2); 
    text ="<p>"  + count.toString()+ " "+ stockObject.p + " " + stockObject.q + " " + timeStamp + "</p>"+text;
    webPriceElement.innerHTML=text;
    webPriceElement.style.color= !lastPrice || lastPrice === price? "black" : lastPrice > price ? "green" : "red";

    lastPrice = price;
}


ws.onerror = (error) => {
    console.log("${error.message}");
  };
ws.onopen= (error) => {
    console.log("websocket open");
  };