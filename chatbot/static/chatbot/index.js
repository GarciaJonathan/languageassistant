localStorage.setItem("chatHistory", "");

language_base = "english";
language_target = "german";

character = "an exchange student";
setting = "the campus cafeteria";

initial_prompt = 
`You are going to roleplay as ${character}. The setting is ${setting}. 
Please give only short answers. In each prompt I will keep adding the previous chat messages so you have context and can answer accordingly.
You will always end your original and translated answer with a question.
Your answers will always follow this exact JSON format:
{"original": "your answer in ${language_base} + a question for me", 
"translated": "your answer in ${language_target} + a question for me"
"correction": "here you will tell me how to correct the mistakes in my last message"} `;

prompt(initial_prompt,"hide_answer");

document.addEventListener('DOMContentLoaded', function() {

    //document.querySelector('#ask-question').addEventListener('click', prompt);

    document.querySelector('#question-form').addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          prompt(document.querySelector('#user-question').value);
          document.querySelector('#question-form').reset();
        }
      });
});

function tts(text) {

    const message = new SpeechSynthesisUtterance(text);

    message.onstart = function() {
        console.log('TTS started speaking');
    };
    message.onend = function() {
        console.log('TTS finished speaking');
    };
    message.lang = "de-DE";
    speechSynthesis.speak(message);
}

function create_bubble(container, content, parameter) {

    bubbleType = parameter + '-message'
    
    chatBubble = document.createElement('div');
    
    if (bubbleType=="original-message" || bubbleType=="translated-message"){

        content = String(content).slice(7,-4);

        body = JSON.parse(content);

        widthBubble = 'calc(' + String(body['original']).length + 'rem/2 + 2rem)';
        
        body = body[parameter];

        translateButton = document.createElement("button");
        translateButton.setAttribute("class", "translate-button")

        translateButton.addEventListener('click', function() {
            this.parentNode.parentNode.querySelector('.translated').style.display = 'block';
            this.parentNode.parentNode.querySelector('.original').style.display = 'block';
            this.parentNode.style.display = 'none';
        });

        chatBubble.appendChild(translateButton);
        chatBubble.appendChild(document.createElement('br'));
        chatBubble.appendChild(document.createTextNode(body));

        if (bubbleType=="translated-message"){
            tts(body);
        }
        chatBubble.style.width = widthBubble;

        if (parameter == "original") {chatBubble.style.display = "none"};
    }
    else {
        chatBubble.appendChild(document.createTextNode(content));
    }
    
    chatBubble.setAttribute("class", 'bubble ' + parameter);
    chatBubble.setAttribute("data-bs-toggle", "tooltip");

    container.appendChild(chatBubble);
    
}

function prompt(prompt, answer = "show_answer") {

    if (answer!="hide_answer"){
        chat = document.querySelector('#chat-view');
        container = document.createElement('div');
        bubbleContainer = document.createElement('div');
        bubbleContainer.setAttribute("class", "bubble-container");
        chat.appendChild(container);
        container.appendChild(bubbleContainer);
        create_bubble(bubbleContainer, prompt, "sent");

        chat.scrollTo(0, chat.scrollHeight);
    }

    console.log("Sent: " + prompt);
    const chatHistory = localStorage.getItem("chatHistory");
    finalPrompt = chatHistory + "Sent: " + prompt

    localStorage.setItem("chatHistory", chatHistory + "Sent: " + prompt);

    fetch('/question', {
        method: 'POST',
        body: JSON.stringify({
            question: finalPrompt,
        })
        
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log("Recieved: " + result);
        const chatHistory = localStorage.getItem("chatHistory");
        localStorage.setItem("chatHistory", chatHistory + "Recieved: " + prompt);

        if (answer!="hide_answer"){
            create_bubble(container, result, "original");
            create_bubble(container, result, "translated"); 
            content = String(result).slice(7,-4);
            container.querySelector(".sent").setAttribute("title", JSON.parse(content)["correction"]);
            chat.scrollTo(0, chat.scrollHeight);
        }
        

    });
}