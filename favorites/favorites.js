const shimmer = document.querySelector('.shimmer-container');

const options = {
   method: 'GET',
   headers: {
      accept: 'application/json',
      "x-cg-deno-api-key": "CG-DVVqLm5x8DjvcVq523LnAmB",
   }
}
const getFavCoins = () => {
   return JSON.parse(localStorage.getItem("favorites")) || [];
}
const fetchFavoritesCoins = async (coinIds) => {
   try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`, options);
      const coinsData = await response.json();
      return coinsData;
   } catch (error) {
      console.log(error);

   }
}
const showShimmer = () => {
   shimmer.style.display = "flex";
};

const hideShimmer = () => {

   shimmer.style.display = "none";
}
const displayFavoritesCoins = (favCoins) => {

   const tableBody = document.getElementById("favorites-table-body");
   tableBody.innerHTML = "";
   favCoins.forEach((coin, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
       <td>${index + 1}</td>
      <td><img src="${coin.image} alt="${coin.name}" width="24" height="24" /></td>
      <td>${coin.name}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
           `;
      tableBody.appendChild(row);

   });

}



document.addEventListener('DOMContentLoaded', async () => {
   try {
      showShimmer();
      const favorites = getFavCoins();//gets the favs list form local storage
      if (favorites.length > 0) {

         const favoritesCoins = await fetchFavoritesCoins(favorites);
         displayFavoritesCoins(favoritesCoins);
      } else {
         const noFavMsg = document.getElementById("no-favorites");
         noFavMsg.style.display = "block";
      }

      hideShimmer();
   } catch (error) {
      console.log(error);
      hideShimmer();
   }
});    