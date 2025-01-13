const coinContainer = document.getElementById('coin-container');
const coinImage = document.getElementById('coin-image');
const shimmerContainer = document.querySelector('.shimmer-container');

const coinName = document.getElementById('coin-name');
const coinDescription = document.getElementById('coin-description');

const coinRank = document.getElementById('coin-rank');
const coinPrice = document.getElementById('coin-price');
const coinMarketCap = document.getElementById('coin-market-cap');

const ctx = document.getElementById('coinChart');
const buttonContainer = document.querySelectorAll('.button-container button');

const options = {
    method: 'GET',
    headers: {
       accept: 'application/json',
       "x-cg-deno-api-key": "CG-DVVqLm5x8DjvcVq523LnAmB",
    }
 }
const urlParam = new URLSearchParams(window.location.search);
console.log(urlParam);
const coinId = urlParam.get('coinId');
console.log(coinId);
 const fetchCoinData = async () => {
  try{
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const coinsData = await response.json();
    console.log(coinsData);
    
  displayCoinsData(coinsData);
  } catch (error){
    console.log("Error while fetching coin data",error);
  } 
}

const displayCoinsData = (coinData) => {
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split(".")[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinName.textContent = coinData.name;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`; 

}
//chart
const coinChart= new Chart(ctx, {
  type:'line',
  data:{
    labels:[],
    datasets:[{
      label:'Price in USD',
      data:[],
      
      borderColor:'#eebc1d',
      borderWidth:1,
      fill:false
    }]
  },
  
});

//fetch the chart data from api



const fetchChartData = async (days)=>{
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,options); 
    const coinChartData = await response.json();
     updateChart(coinChartData.prices);
  } catch (error) {
    console.log("Error while fetching chart data",error);
  }
}

//to display the chart data 
const updateChart = (prices) => {
 const data = prices.map((price)=> price[1]);
 const labels = prices.map((price)=> {
  let date = new Date(price[0]);
  return date.toLocaleDateString();
});
  coinChart.data.labels = labels;
  coinChart.data.datasets[0].data = data;
  coinChart.update();
}

//on btn click fetch the chart data and display it
buttonContainer.forEach((button) => {
  button.addEventListener('click', (e) => {
    const days = e.target.id === "24h" ? 1 : e.target.id === "30d" ? 30 : 90;
    fetchChartData(days);
  });
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCoinData();

    document.getElementById("24h").click();
});