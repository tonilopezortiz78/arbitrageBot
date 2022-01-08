ws= new WebSocket('wss://stream.binance.com:9443/ws/btcbusd@trade');
let ws_bnb= new WebSocket('wss://stream.binance.com:9443/ws/bnbbusd@trade');
let ws_bitkub= new WebSocket('wss://api.bitkub.com/websocket-api/market.trade.thb_bnb');
let ws_satangPro= new WebSocket('wss://ws.satangcorp.com/ws/btc_thb@aggTrade');
let bnbBitkub;
var bnbBinance;
const bitkubLastTradesUrl=("https://api.coingecko.com/api/v3/exchanges/bitkub");

async function loadBitkub() {
  const res2 = await fetch("https://api.coingecko.com/api/v3/exchanges/bitkub");
  const bitkub = await res2.json();
  //console.log("bitkub: " + bitkub.tickers[0].base);
  bnbBitkub= await bitkub.tickers.find( ({ base }) => base === 'BNB' );
  return bnbBitkub;
  //console.log(result);
}
async function loadBinance() {
  const res = await fetch("https://api.coingecko.com/api/v3/exchanges/binance");
  const binance = await res.json();
  bnbBinance= await binance.tickers.filter(({base, target}) => base === 'BNB'&& target === "USDT");
  console.log(bnbBinance);
  
  return bnbBinance[0];
  //console.log(result);
}
let webPriceElement = document.getElementById("webPrice");
let webPriceElement2 = document.getElementById("webPrice2");
let webSimpleData = document.getElementById("simpleData");
let webSimpleData2 = document.getElementById("simpleData2");

let lastPrice= null;
var options = { hour12: false, hour:"numeric", minute:"numeric" ,fractionalSecondDigits: 3 };
var text = "";
var count=0;


loadBitkub().then(function(value){
  //console.log(value);
  webSimpleData.innerHTML = "Bitkub: " + value.base + ": " + value.last+ " THB , " 
  + value.converted_last.usd + " USD ";

  loadBinance().then(function(value2){
    let difference_usd=(value.converted_last.usd-value2.converted_last.usd).toFixed(2);
    let difference_percentage=((difference_usd/value.converted_last.usd)*100).toFixed(3);
    webSimpleData2.innerHTML = "Binance: " + value2.base + ": " + value2.last+ " " + value2.target + " " +
    + value2.converted_last.usd + " USD " + "diff: " + difference_usd + " USD " + difference_percentage + "%";
  })
  
})
  //console.log("object:"+bnbBitkub);
  //console.log("object:"+bnbBinance);
//console.log(bitkub_data);

ws.onmessage = (event) => {
    count ++;
    let stockObject = JSON.parse(event.data);
    //console.log(stockObject);
    let timeStamp = new Date (stockObject.T).toLocaleTimeString('eu',options);
    let price = parseFloat(stockObject.p).toFixed(2); 
    let addStyle= '<p style="color:';
    let addStyle2= !lastPrice || lastPrice === price? 'white";>': lastPrice > price ? 'green";>' : 'red";>';
    addStyle=addStyle+addStyle2;
    text = addStyle +" " + count.toString()+ " "+ price + " " + stockObject.q + " " + timeStamp + "</p>"+text;
    webPriceElement.innerHTML=text;
    //webPriceElement.style.color= !lastPrice || lastPrice === price? "black" : lastPrice > price ? "green" : "red";

    lastPrice = price;
}

ws_bitkub.onmessage = (event) => {
    let stockObject2 = JSON.parse(event.data);
    //console.log(stockObject2);
    //console.log(stockObject2.rat);
    webPriceElement2.innerHTML="<p>"+stockObject2.rat+" " + Date.now()+"</p>";
}


ws_bitkub.onerror = (error) => {
    console.log("${error.message}");
  };
ws_bitkub.onopen= (error) => {
    console.log("websocket bitkub open");
  };
ws.onerror = (error) => {
    console.log("${error.message}");
  };
ws.onopen= (error) => {
    console.log("websocket open");
  };