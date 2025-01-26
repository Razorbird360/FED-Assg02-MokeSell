














const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "Nothing" },
  { minDegree: 31, maxDegree: 90, value: "$20 Voucher" },
  { minDegree: 91, maxDegree: 150, value: "$10 Voucher" },
  { minDegree: 151, maxDegree: 210, value: "Nothing"},
  { minDegree: 211, maxDegree: 270, value: "Nothing" },
  { minDegree: 271, maxDegree: 330, value: "$5 Voucher" },
  { minDegree: 331, maxDegree: 360, value: "Nothing" },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "#4FC3F7",  
  "#1976D2",
  "#4FC3F7",
  "#1976D2",
  "#4FC3F7",
  "#1976D2",
];
function getFontSize() {
  if (window.innerWidth <= 480) {
    return 12; // Small screens, use a smaller font size
  } else if (window.innerWidth <= 768) {
    return 18; // Medium screens, use a medium font size
  } else {
    return 20; // Larger screens, use the default font size
  }
}
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: ["$20 \nVoucher", "Nothing", "$5 \nVoucher", "Nothing", "Nothing", "$10 \nVoucher"],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        borderWidth:1,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: getFontSize()},
      },
    },
  },
});
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      if (i.value == "Nothing") {
      finalValue.innerHTML = `<p>Sorry, you didn't win anything</p>`;
      spinBtn.disabled = false;
      break;
      }
      else {
        finalValue.innerHTML = `<p>Congratulations! You have won a ${i.value}</p>`;
        spinBtn.disabled = false;
        break;
      }
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
window.addEventListener('resize', function () {
  myChart.options.plugins.datalabels.font.size = getFontSize();  // Adjust font size dynamically
  myChart.update(); // Update the chart after resizing
});