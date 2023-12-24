"use strict";
$(() => {
  createHome();
  $("#homeLink").click(() => createHome());
  $("#reportsLink").click(() => createReports());
  $("#aboutLink").click(() => createAbout());

  //   pages creation
  async function createHome() {
    const coins = await getJson("assets/jsons/coins.json");
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
  $("#searchBox").on("input", async () => {
    const searchWord = $("#searchBox").val();
    let matchingCoins = [];
    const coins = await getJson("assets/jsons/coins.json");
    for (const coin of coins) {
      if (
        coin.id.includes(searchWord) ||
        coin.symbol.includes(searchWord) ||
        coin.name.includes(searchWord)
      ) {
        matchingCoins.push(coin);
      }
    }
    if (matchingCoins.length >= 0) {
      displayCoins(matchingCoins);
    }
  });

  //   coin display
  function displayCoins(coins) {
    let content = "";
    let count = 0;
    for (const coin of coins) {
      const div = `<div class="card">
      <button class="checkbox ${coin.symbol}">+</button>
        <div><img src="${coin.image.small}"></div>
        <div>${coin.symbol}</div>
        <div>${coin.name}</div>
        <button id="btn${count}" class='moreInfo' data-coin-id="${coin.id}">More Info</button>
        <div class="more-info hidden">
          more info
        </div>
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
  let chosenButtonsArr = [];

  $("#container").on("click", "button.checkbox", function () {
    this.classList.toggle("checked");

    if (this.classList.contains("checked")) {
      if (chosenButtonsArr.indexOf(this) === -1) {
        if (chosenButtonsArr.length < 5) {
          chosenButtonsArr.push(this);
        } else {
          getCoinsFromButtons(chosenButtonsArr);
          this.classList.remove("checked");
        }
      }
    } else {
      const index = chosenButtonsArr.indexOf(this);
      if (index !== -1) {
        chosenButtonsArr.splice(index, 1);
      }
    }
  });

  let chosenCoinsArr = [];
  async function getCoinsFromButtons(arr) {
    const coins = await getJson("assets/jsons/coins.json");

    chosenCoinsArr = [];

    for (const coin of coins) {
      for (const button of arr) {
        if (coin.symbol === button.classList[1] && chosenCoinsArr.length < 5) {
          chosenCoinsArr.push(coin);
        }
      }
    }

    showModal();
  }

  function showModal() {
    let content = `<div id="modal">`;
    console.log(chosenCoinsArr);
    content += `<button id="modalExit">x</button>`;
    for (const coin of chosenCoinsArr) {
      content += `<div class="modalCard">
          <div><img src="${coin.image.small}"></div>
          <div>${coin.symbol}</div>
          <div>${coin.name}</div>
          <button class="removeBtn ${coin.name}">remove</button>
          </div>`;
    }
    content += `</div>`;
    $("#modalContainer").html(content);
  }

  $("#modalContainer").on("click", "#modalExit", () => hideModal());

  $("#modalContainer").on("click", ".removeBtn", function () {
    const coinNameToRemove = this.classList[1];

    const indexToRemove = chosenCoinsArr.findIndex(
      (coin) => coin.name === coinNameToRemove
    );

    if (indexToRemove !== -1) {
      chosenCoinsArr.splice(indexToRemove, 1);
    }

    hideModal();

    $(".checkbox." + coinNameToRemove).removeClass("checked");
  });

  function hideModal() {
    $("#modal").fadeOut(500, function () {
      const coinNameToRemove = $("#modalExit").data("coinNameToRemove");

      $(".checkbox." + coinNameToRemove).removeClass("checked");
    });
  }

  //   -----------------------------------------------------------------------
  async function getMoreInfo(coinId) {
    let prices = JSON.parse(localStorage.getItem(coinId));
    if (prices) return prices;
    const url = "https://api.coingecko.com/api/v3/coins/" + coinId;
    const coinInfo = await getJson(url);
    const usd = coinInfo.market_data.current_price.usd;
    const eur = coinInfo.market_data.current_price.eur;
    const ils = coinInfo.market_data.current_price.ils;
    prices = { usd, eur, ils };
    localStorage.setItem(coinId, JSON.stringify(prices));
    return prices;
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
