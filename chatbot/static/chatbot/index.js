language_base = "English";
language_base_tts = "en-EN"
language_target = "German";
language_target_tts = "de-DE"
language_level = "B1";

character = "an exchange student";
setting = "the campus cafeteria";

function initial_prompt() {
    return `You are going to roleplay as ${character}. The setting is ${setting}. You are going to answer with the level of ${language_level}. 
    Please give only short answers. In each prompt I will keep adding the previous chat messages so you have context and can answer accordingly.
    Your answers will always follow this exact JSON format:
    {"original": "your answer in ${language_base} + a question for me", 
    "translated": "your answer in ${language_target} + a question for me"
    "correction": "here you will tell me how to correct the mistakes in my last answer to you"} `;
}

document.addEventListener('DOMContentLoaded', function() {
    
    if (localStorage.getItem("userState") == "chat") {
        load_chat_window();
    } else {
        load_config_window();
    }
    
    document.querySelector('#question-form').addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          prompt(document.querySelector('#user-question').value);
          document.querySelector('#question-form').reset();
        }
      });

    document.querySelectorAll("#clear").forEach(button => {
        button.onclick = () => {
                localStorage.setItem("chatHistory", "");
                location.reload();
                console.log(initial_prompt());
                prompt(initial_prompt(),"hide_answer");
            }
    });

    document.querySelectorAll(".setting-item").forEach(button => {
        button.onclick = () => {
                
                localStorage.setItem("chatHistory", "");
                
                setting = button.children[1].children[0].innerHTML
                character = button.children[2].innerHTML
                
                load_chat_window();
                
                prompt(initial_prompt(),"hide_answer");
                
            }
    });

    document.querySelectorAll(".form-target-language").forEach(button => {
        button.onchange = () => {
                language_target = button.options[button.selectedIndex].innerHTML;
                language_target_tts = button.value;
            }
    });

    document.querySelectorAll(".form-base-language").forEach(button => {
        button.onchange = () => {
                language_base = button.options[button.selectedIndex].innerHTML;
                language_base_tts = button.value;
            }
    });

    document.querySelectorAll(".form-level").forEach(button => {
        button.onchange = () => {
                language_level = button.value;
            }
    });

    document.querySelectorAll(".go-to-config").forEach(button => {
        button.onclick = () => {
                load_config_window();
                location.reload();
            }
    });

});

function load_config_window() {
    document.querySelector('#config-window').style.display = 'flex';
    document.querySelector('#chat-window').style.display = 'none'; 
    localStorage.setItem("userState", "config");
}

function load_chat_window() {
    document.querySelector('#config-window').style.display = 'none';
    document.querySelector('#chat-window').style.display = 'flex'; 
    localStorage.setItem("userState", "chat");

    document.querySelector("#target-language").innerHTML = language_target;    
    document.querySelector("#base-language").innerHTML = language_base; 
    document.querySelector("#setting").innerHTML = setting; 
    document.querySelector("#character").innerHTML = character; 
    document.querySelector("#level-language").innerHTML = language_level;

}

function tts(text, language) {

    const message = new SpeechSynthesisUtterance(text);

    message.onstart = function() {
        console.log('TTS started speaking');
    };
    message.onend = function() {
        console.log('TTS finished speaking');
    };
    message.lang = language;
    speechSynthesis.speak(message);
}

function create_bubble(container, content, parameter) {

    bubbleType = parameter + '-message'
    
    chatBubble = document.createElement('div');
    
    if (bubbleType=="original-message" || bubbleType=="translated-message"){

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
            tts(body,language_target_tts);
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

    localStorage.setItem("chatHistory", chatHistory + " Sent: " + prompt);

    fetch('/question', {
        method: 'POST',
        body: JSON.stringify({
            question: finalPrompt,
        })
        
    })
    .then(response => response.json())
    .then(result => {
        console.log("Recieved: " + result);
        if (result[0][0] == '['){
            result = result[0].slice(1, -1);
        }
        const chatHistory = localStorage.getItem("chatHistory");
        console.log(chatHistory);
        localStorage.setItem("chatHistory", chatHistory + " Recieved: " + JSON.parse(result)["translated"]);

        if (answer!="hide_answer"){
            create_bubble(container, result, "original");
            create_bubble(container, result, "translated"); 
            container.querySelector(".sent").setAttribute("title", JSON.parse(result)["correction"]);
            chat.scrollTo(0, chat.scrollHeight);
        } 

    });
}