// DOM Elements
const reportCardContainer = document.getElementsByClassName("report-cards-container")[0];

// Utils
const getSnakeCase = x => x.split(" ").join("-").toLowerCase();
const getWordForState = (word) => {
  switch(word)
  {
    case "daily":
      return "day";
    case "weekly":
      return "week";
    case "monthly":
      return "month"
  }
}
const hover = new MouseEvent('mouseenter', {
  'view': window,
  'bubbles': true,
  'cancelable': true
});

// States
let cardsState = "weekly";

// Create report cards from data.json
function getReportCard(data)
{
    const title = getSnakeCase(data.title);
    const reportCard = document.createElement("div");

    reportCard.id = `report-card-${title}`;
    reportCard.classList.add("report-card");

    reportCard.innerHTML = `
  <div class="report-icon-container">
    <img src="./images/icon-${title}.svg" alt="${title}" class="report-icon">
  </div>
  <div class="report-content">
    <section class="report-type-container">
      <h3 class="report-type" id="report-type-${title}">${data.title}</h3>
      <img src="./images/icon-ellipsis.svg" alt="...">
    </section>
    <section class="report-current-time-container">
      <h2 class="report-current-time" id="report-current-time-${title}">${data.timeframes.weekly.current}hrs</h2>
    </section>
    <section class="report-previous-time-container">
      <h4 class="report-previous-time" id="report-previous-time-${title}">Lask week - ${data.timeframes.weekly.previous}hrs</h4>
    </section>
  </div>
  <div class="rect" id="rect-${title}"></div>`;

  // Animation
  reportCard.addEventListener("mouseenter", () => {
    let rectangle = reportCard.children[2];
    reportCard.style.transform = "scale(1.1)";
        rectangle.style.left = "-15rem"
        setTimeout(() => {
            rectangle.style.transition = "left 0s ease-out";
            reportCard.style.transform = "scale(1)";
            rectangle.style.left = "26rem";
            setTimeout(() => {
              rectangle.style.transition = "left .5s ease-out";
            }, 100);
        }, 500);
    });

  reportCardContainer.append(reportCard);
}

// Update cards when user switches by clicking on buttons
function UpdateCards(type)
{
  if (type === cardsState) return;
  else
  {

    document.getElementById(`button-${cardsState}`).classList.remove("active-section");
    cardsState = type;
    document.getElementById(`button-${type}`).classList.add("active-section");
    
    fetch("./data.json").then(res => res.json()).then(data => {
      
      for (let i = 0; i < data.length; i++)
      {
        const report = data[i];

        const title = getSnakeCase(report.title);
        const requiredTimeframes = report.timeframes[cardsState];

        const reportCard = document.getElementById(`report-card-${title}`);
        const currentTime = document.getElementById(`report-current-time-${title}`);
        const previousTime = document.getElementById(`report-previous-time-${title}`);

        // Animation
        setTimeout(() => {

          reportCard.dispatchEvent(hover);
          currentTime.innerText = `${requiredTimeframes.current}hrs`;
          previousTime.innerText = `Last ${getWordForState(cardsState)} - ${requiredTimeframes.previous}hrs`;
  
        }, i * 150);

      }
    });
  }
}

// Load Cards
fetch("./data.json").then(res => res.json()).then(data => {
  for (let i = 0; i < data.length; i++)
  {
      let item = data[i];
      getReportCard(item);
  }
});