document.addEventListener('DOMContentLoaded', function () {
    const backChat = document.getElementById('back-chat');
    const backHome = document.getElementById('back-home');
    const currentChatName = document.getElementById('current-chat-name');
    const messagesContainer = document.getElementById('messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send');

    const chatMessages = {
        1: ["Hello!", "How can I help you?"],
        2: ["Hi there!", "What's up?"],
    };
    backChat.style.display = 'none'; // Hide back-chat button by default
    backHome.style.display = 'block'; // Hide back-home button by default
    // Add click event listener to each chat
    const chats = document.querySelectorAll('.chat');
    chats.forEach(chat => {
        chat.addEventListener('click', function () {
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
                    backChat.style.display = 'block'; // Ensure back-chat is visible
                }

                const chatId = this.getAttribute('data-chat');
                const chatName = this.querySelector('.chat-name').innerText;

                currentChatName.innerText = chatName;

                messagesContainer.innerHTML = '';
                if (chatMessages[chatId]) {
                    chatMessages[chatId].forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.innerText = message;
                        messagesContainer.appendChild(messageElement);
                    });
                }
            } else {
                // For larger screens, maintain the same behavior
                const chatId = this.getAttribute('data-chat');
                const chatName = this.querySelector('.chat-name').innerText;

                currentChatName.innerText = chatName;

                messagesContainer.innerHTML = '';
                if (chatMessages[chatId]) {
                    chatMessages[chatId].forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.innerText = message;
                        messagesContainer.appendChild(messageElement);
                    });
                }
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
        } else {
            console.log("Please enter a message.");
        }
    });
});
