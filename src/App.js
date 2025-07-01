import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createAssistantMessage } from './services/api';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import logo from './images/logo.png';
import SustainabilityPrompt from './components/SustainabilityPrompt';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promptCount, setPromptCount] = useState(0);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [waitingForSustainabilityAction, setWaitingForSustainabilityAction] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processMessage = async (message, modelId = 'gpt-4o') => {
    if (!message.trim()) return;

    const userMessage = createUserMessage(message);
    userMessage.timestamp = new Date().toISOString();

    const loadingMessage = {
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage, loadingMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const messagesToSend =
        messages.length > 0
          ? [...messages, userMessage]
          : [{ role: 'system', content: 'You are a helpful assistant.' }, userMessage];

      console.log(`Sending message with model: ${modelId}`);
      const response = await sendConversation(messagesToSend, modelId);

      const assistantContent =
        response.choices?.[0]?.message?.content ||
        "I apologize, but I couldn't generate a response.";
      const assistantMessage = createAssistantMessage(assistantContent);
      assistantMessage.timestamp = new Date().toISOString();

      setMessages([...messages, userMessage, assistantMessage]);
    } catch (err) {
      console.error('Error details in App.js:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });

      let errorContent = "Sorry, something went wrong.";

      if (err.message.includes('timeout')) {
        errorContent = "The request timed out. Please try again later.";
      } else if (err.message.includes('rate limit')) {
        errorContent = "Rate limit exceeded. Please try again in a few moments.";
      } else if (err.message.includes('API key')) {
        errorContent = "API configuration issue. Please check your settings.";
      }

      const errorMessage = createAssistantMessage(errorContent);
      errorMessage.timestamp = new Date().toISOString();
      errorMessage.isError = true;
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
      setPendingMessage(null);
      setWaitingForSustainabilityAction(false);
    }
  };

  const handleSendMessage = (message, modelId = 'gpt-4o') => {
    const newPromptCount = promptCount + 1;
    setPromptCount(newPromptCount);
    
    // If this is the third prompt, we need to wait for sustainability action
    if (newPromptCount === 3) {
      setPendingMessage({ message, modelId });
      setWaitingForSustainabilityAction(true);
      
      // Add only the user message to the chat history without generating a response yet
      const userMessage = createUserMessage(message);
      userMessage.timestamp = new Date().toISOString();
      setMessages([...messages, userMessage]);
    } else {
      // For other prompts, process normally
      processMessage(message, modelId);
    }
  };
  
  // Handle user interaction with the sustainability prompt
  const handleSustainabilityAction = (action) => {
    if (pendingMessage && waitingForSustainabilityAction) {
      if (action === 'no' || action === 'cancel') {
        // If user clicks No or Cancel, process the message normally
        processMessage(pendingMessage.message, pendingMessage.modelId);
      } else if (action === 'yes') {
        // If user clicks Yes, show the tips and then process the message
        processMessage(pendingMessage.message, pendingMessage.modelId);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="fixed top-3 left-3 z-10 p-2 rounded-md hover:bg-gray-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="#8e8ea0" strokeWidth="1.5" />
          </svg>
        </button>
      )}

      <div className={`flex flex-col h-full ${sidebarOpen ? 'w-[260px] min-w-[260px]' : 'w-0 min-w-0 overflow-hidden'} bg-gray-50 border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
        <div className="p-3 flex justify-between items-center">
          <button 
            onClick={() => {
              setMessages([]);
              setPromptCount(0);
            }}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <img src={logo} alt="Logo" width="24" height="24" />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="#8e8ea0" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="px-2 py-4 space-y-4">
          <button
            onClick={() => {
              setMessages([]);
              setPromptCount(0);
            }}
            className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 13L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 4H20V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New chat
          </button>
          
          <button className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search chats
          </button>
          
          <button className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Library
          </button>
        </div>
        
        <div className="px-2 py-4 space-y-4">
          <button className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Codex
          </button>
          
          <button className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M15 12L10 15V9L15 12Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sora
          </button>
          
          <button className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            GPTs
          </button>
        </div>

        <div className="flex-1"></div>

        <div className="border-t border-gray-200 p-2">
          <button className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            View plans
          </button>
          <div className="text-xs text-gray-500 mt-1 ml-2">Unlimited access, team features, and more</div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-xl mb-6">
              <h2 className="text-3xl mb-10">What's on the agenda today?</h2>
            </div>
            <div className="w-full max-w-[850px]">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 w-full overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
              <div
                className="h-full overflow-y-auto scroll-smooth pb-4 px-4"
                ref={chatContainerRef}
              >
                <ChatHistory
                  messages={messages}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                />
              </div>
            </div>
            <div className="p-4 bg-white flex justify-center">
              <div className="w-full max-w-[850px]">
                <SustainabilityPrompt 
                  promptCount={promptCount} 
                  onSustainabilityAction={handleSustainabilityAction} 
                />
                <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
