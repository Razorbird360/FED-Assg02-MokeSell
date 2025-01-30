// Moka Points Counter
var points = 500;
document.getElementById("moke-points").innerHTML = points;

var rewards = [
  {
    rewardName: "$15 Off",
    points: 10,
    value: -15,
  },
  {
    rewardName: "$5 Off",
    points: 5,
    value: -5,
  },
  {
    rewardName: "$25 Off",
    points: 50,
    value: -55,
  },
  {
    rewardName: "Spin and Win !",
    points: 250,
    value: -250,
  }
];

const rewardsContainer = document.getElementById("rewards");

rewards.forEach(function(reward) {
  const rewardDiv = document.createElement("div");

  // Creating the innerHTML for the reward
  rewardDiv.innerHTML = `
    <h4>${reward.rewardName}</h4> 
    ${reward.points} Moke Points 
    <button>Redeem</button>
  `;

  // Add event listener to the button
  rewardDiv.querySelector("button").addEventListener("click", function() {
    if (points >= reward.points) {  // Check if the user has enough points
      points -= reward.points;  // Deduct the points

      // Update the points in the UI
      document.getElementById("moke-points").innerHTML = points;

      // Specific logic for "Spin and Win !"
      if (reward.rewardName === "Spin and Win !") {
        window.location.href = "wheelspin.html";  // Navigate to the wheelspin page
      }
    } else {
      alert("You don't have enough points for this reward.");  // Alert if not enough points
    }
  });

  rewardDiv.classList.add("reward");
  rewardsContainer.appendChild(rewardDiv);
});




