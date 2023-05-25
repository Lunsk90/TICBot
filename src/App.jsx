import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import './App.css';
import './custom-styles.css';
import logo from './assets/img/bot.gif'

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola, Soy TICbot!",
      sender: "Chat GPT"
    }
  ]);

  const handleSend = async (messageText) => {
    const newMessage = {
      message: messageText,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "Chat GPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });
  
    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old."
    };
  
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages]
    };
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY
        },
        body: JSON.stringify(apiRequestBody)
      });
  
      const data = await response.json();
      console.log(data);
  
      const newMessage = {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      };
  
      setMessages([...chatMessages, newMessage]);
      setTyping(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
      <div className="message-header">
        <img src={logo} alt="Logo" className="logo" />
        <span className="message-text">Hola, Soy TICbot!</span>
      </div>
        <div style={{ position: 'relative', height: '500px', width: '1225px' }}>
          <MainContainer>
            <ChatContainer>
              <MessageList 
              scrollBehavior='smooth' 
              typingIndicator={typing ? <TypingIndicator content="TICbot está escribiendo ✍🏻 puede tardar un poco así  que por favor espere." /> : null}>
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput placeholder="Escribe tu mensaje acá" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;
