
const shimmer = document.querySelector('.shimmer-container');

const options = {
      method: 'GET',
      headers: {
         accept: 'application/json',
         "x-cg-deno-api-key":"CG-DVVqLm5x8DjvcVq523LnAmB",
      }}
let coins =[];

const fetchCoins = async () => {
 try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_ desc&per_page=100&page-1',options);
   const coinsData = await response.json();
   return coinsData;
 } catch (error) {
    console.log(error);
    
 }
}
const handleFavClick = (coinId) => {};

const showShimmer = () => {   
   
   shimmer.style.display="flex";
}

const hideShimmer = () => {   
   
   shimmer.style.display="none";
}



//window.onload = fetchCoins;

//display the data on the page 

const displayCoins = (coins) => {
   const tableBody = document.getElementById("crypto-table-body");

   tableBody.innerHTML = '';
   coins.forEach((coin,index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${index}</td>
      <td><img src="${coin.image} alt="${coin.name}" width="24" height="24" /></td>
      <td>${coin.name}</td>
      <td>$${coin.current_price}</td>
      <td>$${coin.total_volume}</td>
      <td>$${coin.market_cap}</td>
      <td><i class="fa-solid fa-star favourite-icon data-id="${coin.id}"></i></td>
      `;

      row.querySelector('.favourite-icon').addEventListener('click', (event) => {
       event.stopPropagation();
       handleFavClick(coin.id);
      });
      tableBody.appendChild(row);
   });
};


document.addEventListener('DOMContentLoaded', async () => {
  try {
   showShimmer();
   coins = await fetchCoins();
   displayCoins(coins);
   hideShimmer(); 
  } catch (error) {
   console.log(coins);
   hideShimmer();
  }


});
