const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//Create a new message element and return it 
const createMessageEkement = (content, className ) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
}

//Show a loading animation while waiting for the API response 
const showLoadingAnimation = () =>{
    const html = `  
<div class="message-content">
    <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
    <p class="text"></p>
    <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
    </div>
</div>
<span class="icon material-symbols-rounded">content_copy</span>
`;

const incomingMessageDiv = createMessageEkement(html,"incoming", "loading");
chatList.appendChild(incomingMessageDiv);
}

//Handle sendong outgoing chat messages 
const handleOutgoingChat = () =>{
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage)return; //exit if there is no message 

    const html = `  <div class="message-content">
    <img src="images/user.jpg" alt="User" class="avatar">
    <p class="text"></p>
</div>`;

const outgoingMessageDiv = createMessageEkement(html,"outgoing");
outgoingMessageDiv.querySelector(".text").innerText = userMessage;
chatList.appendChild(outgoingMessageDiv);

typingForm.reset(); //Clear input field
setTimeout(showLoadingAnimation, 500);//show loading animation after a delay
}

//Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    handleOutgoingChat();
});