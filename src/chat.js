import { auth, db, storage } from './app.js';
import { doc, addDoc, collection, Timestamp, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });

document.addEventListener('DOMContentLoaded', function () {
    const backChat = document.getElementById('back-chat');
    const backHome = document.getElementById('back-home');
    const currentChatName = document.getElementById('current-chat-name');
    const messagesContainer = document.getElementById('messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send');
    let chatId;
    let userInputMessage = "";  // Variable to store user's typed message

    // Stores chat history
    const chatUserMessages = {
        1: [],
        2: [],
    };

    backChat.style.display = 'none'; // Hide back-chat button by default
    backHome.style.display = 'block'; // Show back-home button by default

    // Add click event listener to each chat
    const chats = document.querySelectorAll('.chat');
    chats.forEach(chat => {
        chat.addEventListener('click', function () {
            chatId = this.getAttribute('data-chat'); // Get the chat ID on click
            console.log('Selected Chat ID:', chatId); // Log the selected chatId

            // Handle display for small screens (width < 768)
            if (window.innerWidth < 768) {
                const chatList = document.getElementsByClassName('chats')[0];
                if (chatList) {
                    chatList.style.display = 'none';
                }

                const currentChat = document.querySelector('.current-chat');
                if (currentChat) {
                    currentChat.style.display = 'flex';
                }

                if (backHome) {
                    backHome.style.display = 'none'; // Hide back-home button
                }

                if (backChat) {
                    backChat.style.display = 'block'; // Show back-chat button
                }
            }

            // Update the chat name
            const chatName = this.querySelector('.chat-name').innerText;
            currentChatName.innerText = chatName;

            // Update the messages for the selected chat
            messagesContainer.innerHTML = '';
            if (chatUserMessages[chatId]) {
                chatUserMessages[chatId].forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('usersentmessage');
                    messageElement.innerText = message;
                    messagesContainer.appendChild(messageElement);
                });
            }
        });
    });

    // Function to store the user's input in the variable
    function readUserInput() {
        const userInput = userMessageInput.value.trim();
        console.log("User typed:", userInput);

        // Respond based on the user's input
        if (userInput === "Hello" || userInput === "Hi" || userInput === "Hey") {
            console.log("Hello! How can I help you?");
            const newReplyDiv = document.createElement("div"); // Create a valid div element
            newReplyDiv.textContent = "Hello! How can I help you?";
            newReplyDiv.classList.add("replymessage");
        
            setTimeout(function () {
                messagesContainer.appendChild(newReplyDiv); // Append the bot reply after a delay
            }, 1000);  // Delay of 1 second
        } else if (userInput === "") {
            console.log("Please enter a message.");
        } else if (userInput === "How much is the product?") {
            console.log("The product costs $100.");
            const newReplyDiv = document.createElement("div"); // Create a valid div element
            newReplyDiv.textContent = "The product costs $100.";
            newReplyDiv.classList.add("replymessage");
        
            setTimeout(function () {
                messagesContainer.appendChild(newReplyDiv); // Append the bot reply after a delay
            }, 1000);  // Delay of 1 second
        } else if (userInput === "Bye") {
            console.log("Goodbye! Have a great day.");
            const newReplyDiv = document.createElement("div"); // Create a valid div element
            newReplyDiv.textContent = "Goodbye! Have a great day.";
            newReplyDiv.classList.add("replymessage");
        
            setTimeout(function () {
                messagesContainer.appendChild(newReplyDiv); // Append the bot reply after a delay
            }, 1000);  // Delay of 1 second
        } else if (userInput === "Where would you like to meet?") {
            console.log("We can meet at the park.");
            const newReplyDiv = document.createElement("div"); // Create a valid div element
            newReplyDiv.textContent = "We can meet at the park.";
            newReplyDiv.classList.add("replymessage");
        
            setTimeout(function () {
                messagesContainer.appendChild(newReplyDiv); // Append the bot reply after a delay
            }, 1000);  // Delay of 1 second
        } else if (userInput === "How do you want to pay?") {
            console.log("You can pay using cash or card.");
            const newReplyDiv = document.createElement("div"); // Create a valid div element
            newReplyDiv.textContent = "You can pay using cash or card.";
            newReplyDiv.classList.add("replymessage");
        
            setTimeout(function () {
                messagesContainer.appendChild(newReplyDiv); // Append the bot reply after a delay
            }, 1000);  // Delay of 1 second
        }        
    }

    // Handle sending a new message
    userMessageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });

    sendButton.addEventListener("click", function () {
        // Get the user input before the message is sent
        userInputMessage = userMessageInput.value.trim();

        if (userInputMessage !== "" && chatId !== undefined) {
            // Create a new div for the user message
            const newMessageDiv = document.createElement("div");
            newMessageDiv.textContent = userInputMessage; // Use the stored message
            newMessageDiv.classList.add("usersentmessage");
            messagesContainer.appendChild(newMessageDiv);

            // Add the new message to the chat history
            if (!chatUserMessages[chatId]) {
                chatUserMessages[chatId] = []; // Initialize the chat if not exists
            }
            chatUserMessages[chatId].push(userInputMessage);

            // Call the bot's response function after sending the user message
            readUserInput();

            // Clear the input field
            userMessageInput.value = "";
            userInputMessage = ""; // Clear the stored message after sending
        } else {
            console.log("Please select a chat and enter a message.");
        }
    });
});
