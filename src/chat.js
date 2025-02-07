document.addEventListener('DOMContentLoaded', function () {
    const chats = document.querySelectorAll('.chat');
    const currentChatName = document.getElementById('current-chat-name');
    const messagesContainer = document.getElementById('messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send');

    // Sample messages for each chat
    const chatMessages = {
        1: ["Hello!", "How can I help you?"],
        2: ["Hi there!", "What's up?"],
    };  

    if (window.innerWidth < 768) {
        // Make sure chats are selected first
        const chats = document.querySelectorAll('.chat'); // Query all chat elements
        const currentChatName = document.getElementById('current-chat-name'); // Assuming you have an element with this ID
        const messagesContainer = document.getElementById('messages-container'); // Assuming an ID for the messages container
        const sendButton = document.getElementById('send'); // Assuming an ID for the send button
        const userMessageInput = document.getElementById('user-message'); // Assuming an ID for the user input
    
        // Add click event listener to each chat
        chats.forEach(chat => {
            chat.addEventListener('click', function () {
                const chatId = this.getAttribute('data-chat');
                const chatName = this.querySelector('.chat-name').innerText;
    
                // Update the current chat name
                currentChatName.innerText = chatName;
    
                // Load messages for the selected chat
                messagesContainer.innerHTML = ''; // Clear previous messages
                if (chatMessages[chatId]) {
                    chatMessages[chatId].forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.innerText = message;
                        messagesContainer.appendChild(messageElement);
                    });
                }
    
                // Hide the chat list and header when selecting a chat on mobile
                document.getElementById('chat-responsive-header').style.display = 'none';
                const chatsContainer = document.getElementsByClassName('chats')[0]; // Get the first chat container
                if (chatsContainer) {
                    chatsContainer.style.display = 'none';
                }
            });
        });
    
        // Handle sending a new message
        userMessageInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                sendButton.click();
            }
        });
    
        sendButton.addEventListener("click", function () {
            const messageValue = userMessageInput.value.trim();
            if (messageValue !== "") {
                const newMessageDiv = document.createElement("div");
                newMessageDiv.textContent = messageValue;
                newMessageDiv.classList.add("usersentmessage");
                messagesContainer.appendChild(newMessageDiv);
                userMessageInput.value = ""; // Clear the input field
                console.log("Message sent:", messageValue);
            } else {
                console.log("Please enter a message.");
            }
        });
    }
    
    else {
        // Add click event listener to each chat
        chats.forEach(chat => {
            chat.addEventListener('click', function () {
                const chatId = this.getAttribute('data-chat');
                const chatName = this.querySelector('.chat-name').innerText;

                // Update the current chat name
                currentChatName.innerText = chatName;

                // Load messages for the selected chat
                messagesContainer.innerHTML = '';
                if (chatMessages[chatId]) {
                    chatMessages[chatId].forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.innerText = message;
                        messagesContainer.appendChild(messageElement);
                    });
                }
            });
        });

        // Handle sending a new message
        userMessageInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                sendButton.click();
            }
        });

        sendButton.addEventListener("click", function () {
            const messageValue = userMessageInput.value.trim();
            if (messageValue !== "") {
                const newMessageDiv = document.createElement("div");
                newMessageDiv.textContent = messageValue;
                newMessageDiv.classList.add("usersentmessage");
                messagesContainer.appendChild(newMessageDiv);
                userMessageInput.value = ""; // Clear the input field
                console.log("Message sent:", messageValue);
            } else {
                console.log("Please enter a message.");
            }
        });
    }
});