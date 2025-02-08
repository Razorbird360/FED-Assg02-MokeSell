const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "100 Moke Points" },
  { minDegree: 31, maxDegree: 90, value: "$25 Voucher" },
  { minDegree: 91, maxDegree: 150, value: "$10 Voucher" },
  { minDegree: 151, maxDegree: 210, value: "10 Moke Points"},
  { minDegree: 211, maxDegree: 270, value: "50 Moke Points" },
  { minDegree: 271, maxDegree: 330, value: "$50 Voucher" },
  { minDegree: 331, maxDegree: 360, value: "50 Moke Points" },
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
    return 20; // Small screens, use a smaller font size
  } else if (window.innerWidth <= 768) {
    return 21; // Medium screens, use a medium font size
  } else {
    return 21; // Larger screens, use the default font size
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
    labels: ["$25 \nVoucher", " 100 Moke\n\t\t\t\tPoints", "$50 \nVoucher", "50 Moke \nPoints", "10 Moke \nPoints", "$10 \nVoucher"],
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
        color: "#00000",
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
        finalValue.innerHTML = `<p>Congratulations! You have won <strong>${i.value}</strong></p>`;
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
let hasClicked = false; // Flag to track if the button has been clicked

spinBtn.addEventListener("click", () => {
  if (hasClicked) return; // Prevent multiple clicks

  // Mark the button as clicked
  hasClicked = true;

  // Disable the button to prevent future clicks
  spinBtn.disabled = true;

  // Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  // Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);

  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    // Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    // Update chart with new value
    myChart.update();

    // If rotation > 360, reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree); // Trigger final value logic
      clearInterval(rotationInterval); // Stop the interval when we reach the target
      count = 0; // Reset count
      resultValue = 101; // Reset rotation speed
      
      // Re-enable the spin button after the spin finishes
      spinBtn.disabled = false; // Optional: re-enable the button here if you want it clickable again later
    }
  }, 10);
});

window.addEventListener('resize', function () {
  myChart.options.plugins.datalabels.font.size = getFontSize();  // Adjust font size dynamically
  myChart.update(); // Update the chart after resizing
});