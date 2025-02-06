document.addEventListener('DOMContentLoaded', function() {
    var userMessageInput = document.querySelector("#user-message");
    var sendButton = document.querySelector("#send");
    var messageDisplay = document.querySelector("#messages");
    userMessageInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
    sendButton.addEventListener("click", function() {
        var messageValue = userMessageInput.value.trim();

        if (messageValue !== "") {
            var newMessageDiv = document.createElement("div");
            newMessageDiv.textContent = messageValue;
            newMessageDiv.classList.add("usersentmessage");
            messageDisplay.appendChild(newMessageDiv);

            userMessageInput.value = ""; 

            console.log("Message sent:", messageValue); 
        } else {
            console.log("Please enter a message.");
        }
    });
});
