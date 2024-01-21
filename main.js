"use strict";

// Function to initialize the application
$(async () => {
  // Set interval to fetch random news every 15 seconds
  setInterval(() => {
    getRandomNewsItem();
  }, 15000);

  // Fetch coins data from JSON file
  const coins = await getJson("assets/jsons/coins.json");

  // Map to store selected coins
  let chosenCoins = new Map();

  // Hide the search box initially
  $("#searchBox").hide();

  // Event handler for delaying navigation from start page to home (for the animation)
  $(".toggler").click(() => {
    setTimeout(() => {
      $("#homeLink").addClass("active");
      createHome();
    }, 200);
  });

  // Reload the page on clicking the navbar brand or logo
  $(".navbar-brand, .logoPic").click(() => {
    location.reload();
  });

  // Navbar links
  $("#homeLink").click(() => createHome());
  $("#reportsLink").click(() => createReports());
  $("#aboutLink").click(() => createAbout());

  // Function to create the home page
  function createHome() {
    // Display coins on the home page
    displayCoins(coins);
    $(".notFoundImg").addClass("hidden");
    $("#chartContainer").hide();
    $("#searchBox").show();
    $("#container").show();

    // click previously selected buttons if there are any
    const selectButtons = $(".checkbox").toArray();
    if (chosenCoins.size > 0) {
      console.log(chosenCoins);

      for (const button of selectButtons) {
        if (chosenCoins.has(button.id)) {
          $(button).addClass("checked");
          $(button).click();
        }
      }
      console.log(selectButtons);
    }
    console.log(chosenCoins);
  }
  // Function to create the reports page and hide the unused elements
  function createReports() {
    $("#container").hide();
    $("#searchBox").hide();
    $("#chartContainer").show();

    // Display a image if no coins are selected
    if (chosenCoins.size <= 0) {
      $("#notFoundContainer").show();
      $(".notFoundImg").removeClass("hidden");
      $("#chartContainer").hide();
    } else {
      $(".notFoundImg").addClass("hidden");
    }

    // Extract selected coins into an array
    let chosenCoinsArr = [];
    for (const coin of chosenCoins) {
      chosenCoinsArr.push(coin[1]);
    }

    // Variables to store coin names and data points for the chart
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

    // Set coin names based on selection
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
        fontColor: "rgb(32,138,74)",
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
    // Initialize the chart
    let chart = $("#chartContainer").CanvasJSChart(options);

    // Function to toggle visibility of data series on the chart
    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }

    // Update interval for chart data
    let updateInterval = 2000;

    let time = new Date();

    // Function to update the chart with new data
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
    // Initial call to populate chart with data
    updateChart(100);

    // Set interval to continuously update the chart
    setInterval(function () {
      updateChart();
    }, updateInterval);
  }

  // Function to create the about page
  function createAbout() {
    $(".notFoundImg").addClass("hidden");
    $("#container").show();
    $("#searchBox").hide();
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

  //   Search function
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

  // Function to display coins on the home page
  function displayCoins(coins) {
    let content = "";
    let count = 0;
    for (const coin of coins) {
      const div = `<div class="card card${coin.name}">
      <div id="menuToggle">
      <input class="checkbox ${coin.symbol} " id="checkbox${coin.id}" type="checkbox">
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

  // Event listener for displaying more information on coin click
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

  // Set interval to clear local storage every 2 minutes
  setInterval(() => {
    localStorage.clear();
  }, 120000);

  // Event listener for selecting/deselecting coins
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

  // Parallax effect on scroll
  const parallax = document.querySelectorAll("body");
  const speed = 0.5;

  window.onscroll = function () {
    [].slice.call(parallax).forEach(function (el) {
      const windowYOffset = window.pageYOffset;
      const elBackgroundPos = "0%" + windowYOffset * speed + "px";
      el.style.backgroundPosition = elBackgroundPos;
    });
  };

  // Function to show modal when maximum coins are selected
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

  // Event listener for removing a coin from modal
  $("#modalContainer").on("click", ".removeBtn", function () {
    for (const coin of $(`.card`).toArray()) {
      if (coin.children[3].innerText === this.classList[1]) {
        $(coin.children[0].children[0]).click();
      }
    }
    hideModal();
  });
  // Event listener for closing the modal
  $("#modalContainer").on("click", ".closeBtn", function () {
    const lastCoin = Array.from(chosenCoins.entries())[chosenCoins.size - 1];
    $(`#${lastCoin[0]}`).click();
    console.log(chosenCoins);

    hideModal();
  });

  // Function to hide the modal
  function hideModal() {
    $("#container").removeClass("modal-open");
    $("nav").removeClass("modal-open");
    $("#modal").fadeOut(500);
  }

  // Function to fetch more information about a coin
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

  // Function to show a spinner while fetching more information
  function showSpinner(coinId) {
    $(`#spinner${coinId}`).removeClass("hidden");
  }

  // Function to hide the spinner
  function hideSpinner(coinId) {
    $(`#spinner${coinId}`).addClass("hidden");
  }

  // Function to fetch a random news item
  async function getRandomNewsItem() {
    const news = await getJson("assets/jsons/news.json");
    $(".ticker__item").text(
      news.headlines[Math.floor(Math.random() * 29)].title
    );
  }

  // Function to fetch JSON data from a URL
  async function getJson(url) {
    const response = await fetch(url);
    const json = response.json();
    return json;
  }
});
