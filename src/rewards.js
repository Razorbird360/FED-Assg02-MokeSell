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
    points:250,
    value: -250,
  }
];

const rewardsContainer = document.getElementById("rewards");
rewards.forEach(function(reward) {
  const rewardDiv = document.createElement("div");
  rewardDiv.innerHTML = `<h4>${reward.rewardName}</h4> ${reward.points} Moke Points <button>Redeem</button>`;
  if (reward.rewardName == "Spin and Win !")
    rewardDiv.innerHTML = `<h4>${reward.rewardName}</h4> ${reward.points} Moke Points <button>Spin</button>`;
    rewardDiv.querySelector("button").addEventListener("click", function() {
      window.location.href = "wheelspin.html";
    });
  rewardDiv.classList.add("reward");
  rewardsContainer.appendChild(rewardDiv);
});

