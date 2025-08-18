import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createAssistantMessage } from './services/api';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import logo from './images/logo.png';
import SustainabilityPrompt from './components/SustainabilityPrompt';
import { ConvexProviderWrapper, useUser } from './contexts/ConvexContext';
import { useStoreConversation } from './services/convexService';

function AppContent() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promptCount, setPromptCount] = useState(0);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [waitingForSustainabilityAction, setWaitingForSustainabilityAction] = useState(false);
  const [waitingForEighthAction, setWaitingForEighthAction] = useState(false);
  const [eighthMessagePromptShown, setEighthMessagePromptShown] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { userId } = useUser();
  const storeConversation = useStoreConversation();
  const [isSaveEarthEnabled, setIsSaveEarthEnabled] = useState(false); // Always start with Save Earth disabled

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

useEffect(() => {
  const interval = setInterval(() => {
    const tools = localStorage.getItem('activeTools');
    if (tools) {
      try {
        const parsed = JSON.parse(tools);
        setIsSaveEarthEnabled(parsed.saveEarth === true);
      } catch {
        setIsSaveEarthEnabled(false);
      }
    }
  }, 1000); // check every second

  return () => clearInterval(interval);
}, []);

  const processMessage = async (message, modelId = 'gpt-4o') => {
    if (!message.trim()) return;
    
    // Check if the message is the special keyword to display user ID
    if (message.trim().toUpperCase() === 'GREENERAI') {
      // Create user message object
      const userMessage = createUserMessage(message);
      userMessage.timestamp = new Date().toISOString();
      
      // Create response with user ID
      const userIdResponse = createAssistantMessage(`Your User ID is: ${userId || 'Not available'}`);
      userIdResponse.timestamp = new Date().toISOString();
      
      // Update messages with both the user message and the response
      setMessages([...messages, userMessage, userIdResponse]);
      return; // Exit early, don't process further
    }

    // Create user message object
    const userMessage = createUserMessage(message);
    userMessage.timestamp = new Date().toISOString();
    
    // Check if this message is already in the chat history (to avoid duplicates)
    const isMessageAlreadyAdded = messages.some(msg => 
      msg.role === 'user' && msg.content === message
    );
    
    // Create loading message
    const loadingMessage = {
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };
    
    // Only add the user message if it's not already in the chat history
    const updatedMessages = isMessageAlreadyAdded 
      ? [...messages, loadingMessage] 
      : [...messages, userMessage, loadingMessage];
      
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
      
      // If the user message was already in the chat history, don't add it again
      const isMessageAlreadyAdded = messages.some(msg => 
        msg.role === 'user' && msg.content === message
      );
      
      setMessages(isMessageAlreadyAdded 
        ? [...messages, assistantMessage]
        : [...messages, userMessage, assistantMessage]);
        
      // Store conversation in Convex if user is authenticated
      if (userId) {
        try {
          await storeConversation(message, assistantContent);
          console.log('Conversation stored in Convex');
        } catch (error) {
          console.error('Failed to store conversation in Convex:', error);
        }
      }
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
      
      // If the user message was already in the chat history, don't add it again
      const isMessageAlreadyAdded = messages.some(msg => 
        msg.role === 'user' && msg.content === message
      );
      
      setMessages(isMessageAlreadyAdded 
        ? [...messages, errorMessage]
        : [...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
      setPendingMessage(null);
      setWaitingForSustainabilityAction(false);
    }
  };

  // Track if we've already shown the sustainability prompt
  const [sustainabilityPromptShown, setSustainabilityPromptShown] = useState(false);

  const handleSendMessage = (message, modelId = 'gpt-4o') => {
    const newPromptCount = promptCount + 1;
    setPromptCount(newPromptCount);
  
    if (newPromptCount === 3 && !sustainabilityPromptShown) {
      if (isSaveEarthEnabled) {
        setPendingMessage({ message, modelId });
        setWaitingForSustainabilityAction(true);
        setSustainabilityPromptShown(true);
  
        const userMessage = createUserMessage(message);
        userMessage.timestamp = new Date().toISOString();
        setMessages([...messages, userMessage]);
      } else {
        processMessage(message, modelId);
        setSustainabilityPromptShown(true);
      }
    } else if (newPromptCount === 6 && !eighthMessagePromptShown) {
      if (isSaveEarthEnabled) {
        setPendingMessage({ message, modelId });
        setWaitingForEighthAction(true);
        setEighthMessagePromptShown(true);
  
        const userMessage = createUserMessage(message);
        userMessage.timestamp = new Date().toISOString();
        setMessages([...messages, userMessage]);
      } else {
        processMessage(message, modelId);
        setEighthMessagePromptShown(true);
      }
    } else {
      // For all other prompts
      processMessage(message, modelId);
    }
  };
  
  
  // Handle user interaction with the sustainability prompt
  const handleSustainabilityAction = (action) => {
    // Handle 3rd message sustainability prompt actions
    if (pendingMessage && waitingForSustainabilityAction) {
      if (action === 'no' || action === 'cancel') {
        // If user clicks No or Cancel, process the message normally
        processMessage(pendingMessage.message, pendingMessage.modelId);
      } else if (action === 'yes') {
        // If user clicks Yes, show the tips but don't process the message yet
        // We'll wait for explicit user interaction with the Continue button
        // The Continue button is added in the SustainabilityPrompt component
      } else if (action === 'continue') {
        // Process the message when the user explicitly clicks Continue
        if (pendingMessage) {
          processMessage(pendingMessage.message, pendingMessage.modelId);
        }
      } else if (action === 'reword') {
        // If user clicks Reword Prompt, remove the last message and reset the prompt count
        // This allows the user to rewrite their third prompt
        if (messages.length > 0) {
          // Remove the last message (which is the third prompt)
          const newMessages = messages.slice(0, -1);
          setMessages(newMessages);
          
          // Reset the prompt count to 2 so the next message will be the third prompt again
          setPromptCount(2);
          
          // Clear the pending message
          setPendingMessage(null);
          setWaitingForSustainabilityAction(false);
          
          // Keep the sustainability prompt shown flag true so it doesn't show again
          // We've already shown it once, we don't need to show it again for the reworded prompt
        }
      }
    }
    
    // Handle 8th message sustainability prompt actions
    if (pendingMessage && waitingForEighthAction) {
      if (action === 'eighth-no') {
        // If user clicks No, process the message normally
        processMessage(pendingMessage.message, pendingMessage.modelId);
        setWaitingForEighthAction(false);
      } else if (action === 'eighth-yes') {
        // If user clicks Yes, show a thank you message and don't process the message
        if (messages.length > 0) {
          // Create a thank you message
          const thankYouMessage = createAssistantMessage("Thanks for taking a break!");
          thankYouMessage.timestamp = new Date().toISOString();
          
          // Update the messages with the thank you message
          setMessages([...messages, thankYouMessage]);
          
          // Clear the pending message and reset waiting state
          setPendingMessage(null);
          setWaitingForEighthAction(false);
        }
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
            <h2 className="text-3xl mb-10 text-center">
            <h2 className="text-3xl text-center text-gray-900 mb-10 font-normal">
  Turn on <img src="/images/leaf-svg.svg" alt="leaf" style={{ width: '24px', height: '24px', display: 'inline', marginRight: '4px', marginLeft: '4px' }} /> <button
    onClick={() => {
      const current = JSON.parse(localStorage.getItem('activeTools') || '{}');
      const updated = { ...current, saveEarth: true };
      localStorage.setItem('activeTools', JSON.stringify(updated));
      setIsSaveEarthEnabled(true);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));
    }}
    className="text-green-600 underline hover:text-green-700 transition"
  >
    Save Earth
  </button> tool for sustainable and eco-friendly chats.
</h2>



</h2>
             
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
              {isSaveEarthEnabled && (
   <SustainabilityPrompt 
    promptCount={promptCount} 
    onSustainabilityAction={handleSustainabilityAction}
    waitingForAction={waitingForSustainabilityAction}
    waitingForEighthAction={waitingForEighthAction}
  />
)}
                <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ConvexProviderWrapper>
      <AppContent />
    </ConvexProviderWrapper>
  );
}

export default App;
