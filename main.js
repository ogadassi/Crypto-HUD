"use strict";
$(async () => {
  const coins = await getJson("assets/jsons/coins.json");
  let chosenCoins = new Map();
  createAbout();
  $("#homeLink").click(() => createHome());
  $("#reportsLink").click(() => createReports());
  $("#aboutLink").click(() => createAbout());

  //   pages creation
  function createHome() {
    $("#chartContainer").hide();
    $("#container").show();
    chosenCoins.clear();
    displayCoins(coins);
    setInterval(() => {
      getRandomNewsItem();
    }, 15000);
  }

  function createReports() {
    $("#container").hide();
    $("#chartContainer").show();

    let chosenCoinsArr = [];
    for (const coin of chosenCoins) {
      chosenCoinsArr.push(coin[1]);
    }

    let coinName1 = "",
      coinName2 = "",
      coinName3 = "",
      coinName4 = "",
      coinName5 = "";

    let dataPoints1 = [];
    let dataPoints2 = [];
    let dataPoints3 = [];
    let dataPoints4 = [];
    let dataPoints5 = [];

    if (chosenCoinsArr[0]) coinName1 = chosenCoinsArr[0].name;
    if (chosenCoinsArr[1]) coinName2 = chosenCoinsArr[1].name;
    if (chosenCoinsArr[2]) coinName3 = chosenCoinsArr[2].name;
    if (chosenCoinsArr[3]) coinName4 = chosenCoinsArr[3].name;
    if (chosenCoinsArr[4]) coinName5 = chosenCoinsArr[4].name;

    let options = {
      title: {
        text: "Live Coin Report",
      },
      axisX: {
        title: "Time",
      },
      axisY: {
        title: "Value",
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "rgb(0,0,0)",
        itemclick: toggleDataSeries,
      },
      data: [
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "###.00$",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: coinName1 ? coinName1 : "",
          dataPoints: dataPoints1,
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "###.00$",
          showInLegend: true,
          name: coinName2 ? coinName2 : "",
          dataPoints: dataPoints2,
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "###.00$",
          showInLegend: true,
          name: coinName3 ? coinName3 : "",
          dataPoints: dataPoints3,
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "###.00$",
          showInLegend: true,
          name: coinName4 ? coinName4 : "",
          dataPoints: dataPoints4,
        },
        {
          type: "line",
          xValueType: "dateTime",
          yValueFormatString: "###.00$",
          showInLegend: true,
          name: coinName5 ? coinName5 : "",
          dataPoints: dataPoints5,
        },
      ],
    };

    let chart = $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }

    let updateInterval = 2000;

    let time = new Date();

    async function updateChart() {
      time.setTime(time.getTime() + updateInterval);
      let str = "";
      for (const coin of chosenCoinsArr) {
        str += coin.symbol + ",";
      }

      const coinValues = await getJson(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`
      );

      let value1, value2, value3, value4, value5;

      if (chosenCoinsArr[0])
        value1 = coinValues[chosenCoinsArr[0].symbol.toUpperCase()].USD;
      if (chosenCoinsArr[1])
        value2 = coinValues[chosenCoinsArr[1].symbol.toUpperCase()].USD;
      if (chosenCoinsArr[2])
        value3 = coinValues[chosenCoinsArr[2].symbol.toUpperCase()].USD;
      if (chosenCoinsArr[3])
        value4 = coinValues[chosenCoinsArr[3].symbol.toUpperCase()].USD;
      if (chosenCoinsArr[4])
        value5 = coinValues[chosenCoinsArr[4].symbol.toUpperCase()].USD;

      if (value1) {
        dataPoints1.push({
          x: time.getTime(),
          y: value1,
        });
        options.data[0].legendText = coinName1 + " : " + value1 + "$";
      }
      if (value2) {
        dataPoints2.push({
          x: time.getTime(),
          y: value2,
        });
        options.data[1].legendText = coinName2 + " : " + value2 + "$";
      }
      if (value3) {
        dataPoints3.push({
          x: time.getTime(),
          y: value3,
        });
        options.data[2].legendText = coinName3 + " : " + value3 + "$";
      }
      if (value4) {
        dataPoints4.push({
          x: time.getTime(),
          y: value4,
        });
        options.data[3].legendText = coinName4 + " : " + value4 + "$";
      }
      if (value5) {
        dataPoints5.push({
          x: time.getTime(),
          y: value5,
        });
        options.data[4].legendText = coinName5 + " : " + value5 + "$";
      }

      $("#chartContainer").CanvasJSChart().render();
    }
    // generates first set of dataPoints
    updateChart(100);
    setInterval(function () {
      updateChart();
    }, updateInterval);
  }

  function createAbout() {
    $("#container").show();
    $("#chartContainer").hide();
    let aboutContainer = `

    
    <div class="aboutCard rounded m-1 ">
  <div class="row g-0">
    <div class="col-md-6">
      <img src="assets/images/IMG-20230606-WA0021.jpg" class="img-fluid rounded" alt="...">
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h5 class="card-title">Ohad Gadassi</h5>
        <p class="card-text m-1 p-1"> Skilled in HTML, CSS, JavaScript, Bootstrap, jQuery, AJAX, and TypeScript.</p>
        <p class="card-text m-1 p-1"><small class="text-body-secondary">      In my latest project, I've crafted a sleek cryptocurrency info app using
        JavaScript and jQuery. It's a one-stop hub for crypto enthusiasts, offering
        quick access to coin details, live prices, and engaging reports. The app's
        stylish design features a personalized about page with a user profile image.
        Users can effortlessly pick their top five cryptocurrencies, unlocking a cool
        modal display. Plus, there's a dynamic ticker keeping you in the loop with
        random crypto news bites. The code is organized for simplicity, making it a
        joy for both users and developers alike.</small></p>
      </div>
    </div>
  </div>
</div>
    
    
    `;

    $("#container").html(aboutContainer);
  }

  //   search function
  $("#searchBox").on("input", () => {
    const searchWord = $("#searchBox").val();
    $(".notFoundImg").removeClass("hidden");

    for (const card of $(".card").toArray()) {
      card.classList.add("hidden");
    }

    let flag = false;
    $("#notFoundContainer").hide();
    for (const coin of coins) {
      if (coin.symbol.toLowerCase().includes(searchWord.toLowerCase())) {
        $(`.card${coin.name}`).removeClass("hidden");
        flag = true;
      }
    }
    if (!flag) {
      $("#notFoundContainer").show();
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
        <div><img class='coinLogo' src="${coin.image.large}"></div>
        <div id='symbol'>(${coin.symbol})</div>
        <div id='name'>${coin.name}</div>
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

  setInterval(() => {
    localStorage.clear();
  }, 120000);

  $("#container").on("click", "input.checkbox", function () {
    for (const coin of coins) {
      if (coin.symbol === this.classList[1]) {
        if (!chosenCoins.has(this.id) && this.checked) {
          this.classList.add("checked");
          chosenCoins.set(this.id, coin);
        }
        if (chosenCoins.has(this.id) && !this.checked) {
          this.classList.remove("checked");
          chosenCoins.delete(this.id);
        }
        if (chosenCoins.size === 6) showModal();
        break;
      }
    }
  });

  function showModal() {
    $("#container").addClass("modal-open");
    $("nav").addClass("modal-open");
    let content = `<div id="modal">
    <div class='closeBtn'>x</div>
    <div class='modalMsg'>
    You can only choose up to 5 coins, Please remove one coin.
    </div>`;

    for (const coin of chosenCoins) {
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
  $("#modalContainer").on("click", ".closeBtn", function () {
    const lastCoin = Array.from(chosenCoins.entries())[chosenCoins.size - 1];
    $(`#${lastCoin[0]}`).click();
    console.log(chosenCoins);

    hideModal();
  });

  function hideModal() {
    $("#container").removeClass("modal-open");
    $("nav").removeClass("modal-open");
    $("#modal").fadeOut(500);
  }

  async function getMoreInfo(coinId) {
    showSpinner(coinId);

    let prices = JSON.parse(localStorage.getItem(coinId));
    if (prices) {
      hideSpinner(coinId);
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
      hideSpinner(coinId);
      return prices;
    } catch (error) {
      hideSpinner(coinId);
      console.log("Error fetching data:", error);
      const div = $(`button[data-coin-id="${coinId}"] + div`);
      div.html(`Fetching prices failed. Please try again later.`).slideToggle();
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
