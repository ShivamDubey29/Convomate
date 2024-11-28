const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");

let userMessage = null;

//API Configuration
const API_KEY = "AIzaSyBiQNqr17DoMqIsgu9JvEbcHIOul1ln1-4";

const API_URl =`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

const localStorageData = () =>{
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = (localStorage.getItem("themeColor") ==="light_mode")

    //Apply theme stored theme 
    document.body.classList.toggle("light_mode",isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    //Restore saved Chats
    chatList.innerHTML = savedChats ||"";
}
localStorageData();


//Create a new message element and return it 
const createMessageEkement = (content, ...classes ) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
//BT Sarted (To be resolved)
//Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement) =>{
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(()=>{
        //Append each word to the text element with a space 
        textElement.innerText +=(currentWordIndex === 0 ? '' :'' ) + words[currentWordIndex++];

        //If all words are displayed 
        if(currentWordIndex === words.length){
            clearInterval(typingInterval)
const chatList = document.querySelector(".chat-list");
            localStorag.setItem("savedChats",chatList.innerHTML); // Save chats to local storage 
        }
    },75);
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

        //Get the API response text
        const apiResponse = data?.candidates[0].content.parts[0].text;
        showTypingEffect(apiResponse, textElement);
    }catch(error){
        console.log(error);
    } finally{
        incomingMessageDiv.classList.remove("loading");
    }
}//BT Ended (To be resolved)

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
<span onClick="copyMessage(this)"class="icon material-symbols-rounded">content_copy</span>`;

const incomingMessageDiv = createMessageEkement(html,"incoming", "loading");
chatList.appendChild(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv);
}

//copy message to clipboard
const copyMessage = (copyIcon) =>{
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText)
    copyIcon.innerText = "done"; //show tick icon
    setTimeout(()=> copyIcon.innerText = "content_copy",1000)//Revert icon after 1 second 
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

//Toggle between light and dark themes 
toggleThemeButton.addEventListener("click", () =>{
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor",isLightMode ? "light_mode" : "dark_mode");
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
})

//Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    handleOutgoingChat();
});