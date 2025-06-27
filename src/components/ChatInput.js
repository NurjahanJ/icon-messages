import React, { useState, useRef, useEffect } from 'react';
import { usePromptCount } from '../contexts/PromptCountContext';
import { useModel } from '../contexts/ModelContext';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  // Add states to track which tools are active
  const [activeTools, setActiveTools] = useState({
    saveEarth: false,
    search: false,
    write: false,
    research: false
  });
  const [isListening, setIsListening] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [toolsMenuPosition, setToolsMenuPosition] = useState({ top: 0, left: 0 });
  const [fileMenuPosition, setFileMenuPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileMenuRef = useRef(null);
  const fileButtonRef = useRef(null);
  const toolsMenuRef = useRef(null);
  const toolsButtonRef = useRef(null);
  const { hasReachedLimit } = usePromptCount();
  const { selectedModel } = useModel();
  
  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  // Handle clicks outside menus to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close file menu when clicking outside
      if (isFileMenuOpen && 
          fileMenuRef.current && 
          !fileMenuRef.current.contains(event.target) &&
          fileButtonRef.current && 
          !fileButtonRef.current.contains(event.target)) {
        setIsFileMenuOpen(false);
      }
      
      // Close tools menu when clicking outside
      if (isToolsMenuOpen && 
          toolsMenuRef.current && 
          !toolsMenuRef.current.contains(event.target) &&
          toolsButtonRef.current && 
          !toolsButtonRef.current.contains(event.target)) {
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFileMenuOpen, isToolsMenuOpen]);
  
  // Focus the textarea when clicked
  const handlePlaceholderClick = () => {
    if (!disabled && !hasReachedLimit) {
      setIsInputActive(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !hasReachedLimit) {
      // Pass both the message and the selected model ID
      onSendMessage(message, selectedModel.id);
      setMessage('');
      
      // Only reset search, write, and research tools, but keep saveEarth state
      setActiveTools(prev => ({
        ...prev,
        search: false,
        write: false,
        research: false
        // saveEarth remains unchanged
      }));
    }
  };
  
  // Speech recognition functionality
  const toggleSpeechRecognition = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      window.recognition = recognition;
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  const stopListening = () => {
    if (typeof window !== 'undefined' && window.recognition) {
      window.recognition.stop();
      setIsListening(false);
    }
  };
  
  // File upload functionality
  const handleFileButtonClick = () => {
    if (!isFileMenuOpen && fileButtonRef.current) {
      const rect = fileButtonRef.current.getBoundingClientRect();
      setFileMenuPosition({
        top: window.scrollY + rect.top - 10,
        left: rect.left
      });
    }
    setIsFileMenuOpen(!isFileMenuOpen);
    if (isToolsMenuOpen) setIsToolsMenuOpen(false);
  };
  
  const handleToolsButtonClick = () => {
    if (!isToolsMenuOpen && toolsButtonRef.current) {
      const rect = toolsButtonRef.current.getBoundingClientRect();
      setToolsMenuPosition({
        top: window.scrollY + rect.top - 10,
        left: rect.left
      });
    }
    setIsToolsMenuOpen(!isToolsMenuOpen);
    if (isFileMenuOpen) setIsFileMenuOpen(false);
  };
  
  const handleFileUpload = () => {
    // This would handle the actual file upload logic
    console.log('File upload functionality would go here');
    setIsFileMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="pt-2 px-4 pb-4 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative rounded-3xl border bg-white border-gray-200 shadow-sm overflow-hidden">
          {/* Input area that replaces 'Ask anything' with user text */}
          <div className="px-4 pt-4 pb-3 cursor-text" onClick={handlePlaceholderClick}>
            {message || isInputActive ? (
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputActive(true)}
                onBlur={() => setIsInputActive(message.length > 0)}
                placeholder=""
                disabled={disabled || hasReachedLimit}
                className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 p-0 m-0"
                rows="1"
                style={{ minHeight: '28px' }}
                autoFocus
              />
            ) : (
              <div className="text-sm text-gray-500 py-1">
                {hasReachedLimit ? "You've reached your daily limit of prompts" : "Ask anything"}
              </div>
            )}
          </div>
          
          {/* Bottom row with buttons */}
          <div className="flex items-center px-2 py-3">
            {/* File Upload Button */}
            <div className="relative">
              <button
                type="button"
                ref={fileButtonRef}
                onClick={handleFileButtonClick}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={disabled || hasReachedLimit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* File upload menu */}
              {isFileMenuOpen && (
                <div ref={fileMenuRef} className="fixed w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" style={{ top: `${fileMenuPosition.top}px`, left: `${fileMenuPosition.left}px`, maxHeight: '300px', overflowY: 'auto', transform: 'translateY(-100%)', marginTop: '-10px' }}>
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <label htmlFor="file-upload" className="flex items-center px-4 py-2 text-sm cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-100" role="menuitem">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="7" y1="12" x2="17" y2="12"></line>
                      <line x1="12" y1="7" x2="12" y2="17"></line>
                    </svg>
                    Add photos and files
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
              </div>
              )}
            </div>
            
            {/* Tools button */}
            <div className="relative">
              <button
                type="button"
                ref={toolsButtonRef}
                onClick={handleToolsButtonClick}
                className="flex items-center ml-2 text-gray-500 hover:text-gray-700"
                disabled={disabled || hasReachedLimit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="ml-1 text-sm">Tools</span>
                {activeTools.saveEarth && (
                  <div className="flex items-center ml-2 text-green-600">
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.44893 17.009C-0.246384 7.83762 7.34051 0.686125 19.5546 3.61245C20.416 3.81881 21.0081 4.60984 20.965 5.49452C20.5862 13.288 17.0341 17.7048 6.13252 17.9857C5.43022 18.0038 4.76908 17.6344 4.44893 17.009Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.99999 21C5.50005 15.5 6 12.5 12 9.99997" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium">Save</span>
                    <button 
                      className="ml-1 text-xs text-green-600 hover:text-green-800" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the tools menu from opening
                        setActiveTools(prev => ({
                          ...prev,
                          saveEarth: false
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </button>
              
              {/* Tools menu */}
              {isToolsMenuOpen && (
                <div ref={toolsMenuRef} className="fixed w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" style={{ top: `${toolsMenuPosition.top}px`, left: `${toolsMenuPosition.left}px`, maxHeight: '300px', overflowY: 'auto', transform: 'translateY(-100%)', marginTop: '-10px' }}>
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <button 
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        // Toggle saveEarth state if it's already active
                        setActiveTools(prev => ({
                          ...prev,
                          saveEarth: !prev.saveEarth,
                          search: false,
                          write: false,
                          research: false
                        }));
                        // Focus the textarea
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }}
                    >
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.44893 17.009C-0.246384 7.83762 7.34051 0.686125 19.5546 3.61245C20.416 3.81881 21.0081 4.60984 20.965 5.49452C20.5862 13.288 17.0341 17.7048 6.13252 17.9857C5.43022 18.0038 4.76908 17.6344 4.44893 17.009Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.99999 21C5.50005 15.5 6 12.5 12 9.99997" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Save the Earth
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100" role="menuitem">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 19.5V18H4.5C3.4 18 2.5 17.1 2.5 16V5C2.5 3.9 3.4 3 4.5 3H19.5C20.6 3 21.5 3.9 21.5 5V16C21.5 17.1 20.6 18 19.5 18H14.5V19.5H9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create an image
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        setActiveTools(prev => ({
                          ...prev,
                          saveEarth: false,
                          search: true,
                          write: false,
                          research: false
                        }));
                        // Focus the textarea
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }}
                    >
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3C14.5013 5.46452 15.9228 8.66283 16 12C15.9228 15.3372 14.5013 18.5355 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3C9.49872 5.46452 8.07725 8.66283 8 12C8.07725 15.3372 9.49872 18.5355 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Search the web
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100" role="menuitem">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 18L12 22L16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 5L12 2L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Write or code
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100" role="menuitem">
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 14.5V17.5C19.5 18.6046 18.6046 19.5 17.5 19.5H6.5C5.39543 19.5 4.5 18.6046 4.5 17.5V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.5 10.5L12 14.5L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Run deep research
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Hidden spacer to maintain layout */}
            <div className="flex-grow px-2"></div>
            
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              disabled={disabled || hasReachedLimit}
              className={`p-2 rounded-full flex items-center justify-center ${
                disabled || hasReachedLimit
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                isListening
                  ? 'text-red-500 bg-gray-100'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            {/* Send button - up arrow button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || hasReachedLimit}
              className={`p-2 ml-1 mr-2 rounded-full ${
                !message.trim() || disabled || hasReachedLimit
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } bg-gray-200 text-gray-600 hover:bg-gray-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-xs mt-2 text-center text-gray-500">
          {disabled ? 'Processing your request...' : ''}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
