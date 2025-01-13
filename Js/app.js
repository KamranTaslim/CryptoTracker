
const shimmer = document.querySelector('.shimmer-container');
const paginationContainer = document.getElementById('pagination');
const sortPriceAsc = document.getElementById('sort-price-asc');
const sortPriceDesc = document.getElementById('sort-price-desc');

const searchBox = document.getElementById('search-box');

const options = {
   method: 'GET',
   headers: {
      accept: 'application/json',
      "x-cg-deno-api-key": "CG-DVVqLm5x8DjvcVq523LnAmB",
   }
}
let coins = [];
let itemsPerPage = 15;
let currentPage = 1;

const fetchCoins = async () => {
   try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_ desc&per_page=100&page-1', options);
      const coinsData = await response.json();
      return coinsData;
   } catch (error) {
      console.log(error);

   }
}
const fetchFavCoins = () => {
   return JSON.parse(localStorage.getItem("favorites")) || [];
}

const saveFavCoins = (favorites) => {
   localStorage.setItem("favorites", JSON.stringify(favorites));

}

const handleFavClick = (coinId) => {
   //save the coin to local storage

   let favorites = fetchFavCoins();

   if (favorites.includes(coinId)) {
      favorites = favorites.filter((id) => id !== coinId);
   } else {
      favorites.push(coinId);
   }
   
   saveFavCoins(favorites);
   displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};
//Search functionality
const handleSearch = () => {
   const searchQuery = searchBox.value.trim();
   
   const filteredCoins = coins.filter((coin) => {
       coin.name.toLowerCase().includes(searchQuery.toLowerCase());
   });
   
   currentPage = 1;
    displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
      renderPagination(filteredCoins);
};

searchBox.addEventListener('input', handleSearch);

// Sort by price
const sortCoinsByPrice = (order) => {
   if(order === 'asc'){
       coins.sort((a, b) => a.current_price - b.current_price);
   } else if(order === 'desc'){
       coins.sort((a, b) => b.current_price - a.current_price);
   }
   currentPage = 1;
   displayCoins(getCoinsToDisplay(coins, currentPage), currentPage); 
   renderPagination(coins);
};

sortPriceAsc.addEventListener('click', () => {
   sortCoinsByPrice('asc');
});

sortPriceDesc.addEventListener('click', () => {
   sortCoinsByPrice('desc');
});

const showShimmer = () => {
   shimmer.style.display = "flex";
};

const hideShimmer = () => {

   shimmer.style.display = "none";
}

const getCoinsToDisplay = (coin, page) => {
   const start = (page - 1) * itemsPerPage; // 15
   const end = start + itemsPerPage; // 30
   return coins.slice(start, end);
}

//window.onload = fetchCoins;

//display the data on the page 

const displayCoins = (coins, currentPage) => {
   const favorites = fetchFavCoins();
   const start = (currentPage - 1) * itemsPerPage + 1;

   const tableBody = document.getElementById("crypto-table-body");

   tableBody.innerHTML = '';
   coins.forEach((coin, index) => {
      const row = document.createElement('tr');
      const isFavorite = favorites.includes(coin.id) ? "favorite" : "";
      row.innerHTML = `
      <td>${start + index}</td>
      <td><img src="${coin.image} alt="${coin.name}" width="24" height="24" /></td>
      <td>${coin.name}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td><i class="fa-solid fa-star favourite-icon ${isFavorite} data-id="${coin.id}"></i></td>
      `;

      row.addEventListener('click', () => {
     window.open(`coin/coin.html?coinId=${coin.id}`, '_blank');
      });

      row.querySelector('.favourite-icon').addEventListener('click', (event) => {
         event.stopPropagation();
         handleFavClick(coin.id);
      });
      tableBody.appendChild(row);
   });
};


const renderPagination = (coins) => {
   const totalPages = Math.ceil(coins.length / itemsPerPage);
   paginationContainer.innerHTML = '';
   for (let i = 1; i <= totalPages; i++) {
      //create btn of total number of pages
      const page = document.createElement('button');
      page.textContent = i;
      page.classList.add("page-button")

      if (i === currentPage) {
         page.classList.add('active');
      }

      //allow click on the button

      page.addEventListener('click', () => {

         currentPage = i;
         updatePaginationButtons();
         displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
         renderPagination(coins);
      });

      paginationContainer.appendChild(page);
   }
}
const updatePaginationButtons = () => {
   const pageBtns = document.querySelectorAll('.page-button');
   pageBtns.forEach((btn, index) => {
      if (index + 1 === currentPage) {
         btn.classList.add('active');
      } else {
         btn.classList.remove('active');
      }
   });
}

document.addEventListener('DOMContentLoaded', async () => {
   try {
      showShimmer();
      coins = await fetchCoins();
      displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
      renderPagination(coins);
      hideShimmer();
   } catch (error) {
      console.log(coins);
      hideShimmer();
   }
});
