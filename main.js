"use strict";
$(async () => {
  const coins = await getJson("assets/jsons/coins.json");
  createHome();

  $("#homeLink").click(() => createHome());
  $("#reportsLink").click(() => createReports());
  $("#aboutLink").click(() => createAbout());

  //   pages creation
  function createHome() {
    displayCoins(coins);
    setInterval(() => {
      getRandomNewsItem();
    }, 15000);
  }

  function createReports() {
    $("#container").html("Reports");
  }

  function createAbout() {
    $("#container").html("About");
  }

  //   search function
  $("#searchBox").on("input", () => {
    const searchWord = $("#searchBox").val();

    for (const card of $(".card")) {
      card.classList.add("hidden");
    }

    for (const coin of coins) {
      if (
        coin.name.toLowerCase().includes(searchWord.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchWord.toLowerCase()) ||
        coin.id.toLowerCase().includes(searchWord.toLowerCase())
      ) {
        $(`.card${coin.name}`).removeClass("hidden");
      }
    }
  });

  //   coin display
  function displayCoins(coins) {
    let content = "";
    let count = 0;
    for (const coin of coins) {
      const div = `<div class="card card${coin.name}">
      <div id="menuToggle">
      <input class="checkbox ${coin.symbol}" id="checkbox${coin.id}" type="checkbox">
      <label class="toggle" for="checkbox${coin.id}">
          <div class="bar bar--top"></div>
          <div class="bar bar--middle"></div>
          <div class="bar bar--bottom"></div>
      </label>
    </div>
        <div><img src="${coin.image.large}"></div>
        <div>${coin.symbol}</div>
        <div>${coin.name}</div>
        <button id="btn${count}" class='moreInfo' data-coin-id="${coin.id}">More Info</button>
        <div class="more-info hidden">
        more info
        </div>
        <div id="spinner${coin.id}" class="spinner hidden"></div>
        
      </div>`;
      content += div;
      count++;
    }

    $("#container").html(content);

    const infoButtons = document.querySelectorAll(".card > .moreInfo");
    for (const button of infoButtons) {
      button.addEventListener("click", toggleMoreInfo);
    }
  }
  async function toggleMoreInfo() {
    const coinId = $(this).data("coin-id");
    const prices = await getMoreInfo(coinId);
    const div = $(`button[data-coin-id="${coinId}"] + div`);

    div
      .html(
        `
      <div>USD: $${prices.usd} </div>
      <div>EUR: €${prices.eur} </div>
      <div>ILS: ₪${prices.ils} </div>
    `
      )
      .slideToggle();
  }

  let chosenCoins = new Map();
  $("#container").on("click", "input.checkbox", function () {
    for (const coin of coins) {
      if (coin.symbol === this.classList[1]) {
        if (!chosenCoins.has(this.id) && this.checked) {
          console.log(this);
          this.classList.add("checked");
          chosenCoins.set(this.id, coin);
        }
        if (chosenCoins.has(this.id) && !this.checked) {
          this.classList.remove("checked");
          chosenCoins.delete(this.id);
        }
        if (chosenCoins.size === 6) showModal();
        console.log(chosenCoins);
        break;
      }
    }
  });

  function showModal() {
    let content = `<div id="modal">`;

    for (const coin of chosenCoins) {
      console.log(coin[1]);
      content += `<div class="modalCard">
      <div><img src="${coin[1].image.small}"></div>
      <div>${coin[1].symbol}</div>
      <div>${coin[1].name}</div>
      <button class="removeBtn ${coin[1].name}">remove</button>
      </div>`;
    }
    content += `</div>`;
    $("#modalContainer").html(content);
  }

  $("#modalContainer").on("click", ".removeBtn", function () {
    for (const coin of $(`.card`).toArray()) {
      if (coin.children[3].innerText === this.classList[1]) {
        $(coin.children[0].children[0]).click();
      }
    }
    hideModal();
  });

  function hideModal() {
    $("#modal").fadeOut(500);
  }

  //   -----------------------------------------------------------------------
  async function getMoreInfo(coinId) {
    showSpinner(coinId); // Show spinner while fetching data

    let prices = JSON.parse(localStorage.getItem(coinId));
    if (prices) {
      hideSpinner(coinId); // Hide spinner if data is retrieved from localStorage
      return prices;
    }

    try {
      const url = "https://api.coingecko.com/api/v3/coins/" + coinId;
      const coinInfo = await getJson(url);
      const usd = coinInfo.market_data.current_price.usd;
      const eur = coinInfo.market_data.current_price.eur;
      const ils = coinInfo.market_data.current_price.ils;
      prices = {
        usd,
        eur,
        ils,
      };
      localStorage.setItem(coinId, JSON.stringify(prices));
      hideSpinner(coinId); // Hide spinner after data is loaded
      return prices;
    } catch (error) {
      hideSpinner(coinId); // Hide spinner in case of an error
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }

  function showSpinner(coinId) {
    $(`#spinner${coinId}`).removeClass("hidden");
  }

  function hideSpinner(coinId) {
    $(`#spinner${coinId}`).addClass("hidden");
  }

  async function getRandomNewsItem() {
    const news = await getJson("assets/jsons/news.json");
    $(".ticker__item").text(
      news.headlines[Math.floor(Math.random() * 29)].title
    );
  }

  async function getJson(url) {
    const response = await fetch(url);
    const json = response.json();
    return json;
  }
});
