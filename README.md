# AI CHATBOT PROJECT

This project consists of a chatbot that helps you learn languages. In the configuration screen, you specify wich language do you want to learn, which language do you want to use as a "base" language, and a level of complexity (from A1 to C2). Then, you select a setting from a list of pre-determined ones, and you start to chat with an AI personality that matches that setting.

You can talk to the AI in the language you want to practice, but also in your own language, if you get stuck. The AI will speak to you with a TTS processer, so you can also hear the language. If you want to check for the translation, you can click on the AI's chat bubble anytime you want. You can also check your own chat bubbles for corrections.

## Distinctiveness and Complexity:

Built from scratch, this project implements many of the tools and techniques covered in CS50W. It mainly uses javascript to represent chat bubbles in a dynamic chat, with functions that allow the user to see the translated responses in real time, and also the corrections for their own prompts. It communicates with the Gemini API in a way that allows the user to access all this information without distorting the flow of the application. It also contains a small database of settings that the app presents to the user so they can choose wich one do they want to practice languages on. The user can also select the difficulty level for the conversation, from A1 to C2.

This app is fully mobile-responsive, meaning you can use it in any screen size and resolution and will adapt itself to better present the information to the user.

This project is different from the other projects from the course because it's an app for learning languages. It's not a browser, since you don't use it to find anything, it's not an e-commerce, since you cannot buy or trade thigs, it's not an e-mail, since you cannot send anything between people, and it's not a network, since you don't connect or interact with other real people. Also none of those projects have been used as a template to create this one.

## Files:

chatbot/static/chatbot:
-background.png: background image for the chat
-index.js: javascript for the project
-styles.css: css for the project

chatbot/templates/chatbot:
-index.html: html for the project

chatbot:
README.md: readme for the project
requirements.txt: python packages required
API_KEY.txt: this is where you have to put the API key provided in the submission

## How to Run:
-Install Gemini package
-Put api key in the API_KEY.txt
-Run the server
-Choose languages, complexity and setting
-Start chatting with the AI