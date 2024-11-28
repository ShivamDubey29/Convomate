const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//API Configuration
const API_KEY = "AIzaSyBiQNqr17DoMqIsgu9JvEbcHIOul1ln1-4";

const API_URl =`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

//Create a new message element and return it 
const createMessageEkement = (content, ...classes ) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

//Fetch response from the API based on user message 
const generateAPIResponse = async (incomingMessageDiv) =>{
    const textElement = incomingMessageDiv.querySelector(".text")//Get text element
    //send a POST request to the API with the user's message
    try{
        const response = await fetch(API_URl,{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify({
                contents:[{
                    role : "user",
                    parts: [{text:userMessage}]
                }]
            })
        });

        const data = await response.json();

        const apiResponse = data?.candidates[0].content.parts[0].text;
        textElement.innerText = apiResponse;
    }catch(error){
        console.log(error);
    } finally{
        incomingMessageDiv.classList.remove("loading");
    }
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
<span class="icon material-symbols-rounded">content_copy</span>`;

const incomingMessageDiv = createMessageEkement(html,"incoming", "loading");
chatList.appendChild(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv);
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