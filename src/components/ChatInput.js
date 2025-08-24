import React, { useState, useRef, useEffect } from 'react';
import { usePromptCount } from '../contexts/PromptCountContext';
import { useModel } from '../contexts/ModelContext';
import {
  PiPaintBrushBroad,
  PiGlobe,
  PiPencilSimpleLine,
  PiBinoculars,
  PiLeaf,
} from 'react-icons/pi';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [activeTools, setActiveTools] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('activeTools');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed;
      }
    }
    return {
      saveEarth: true,
      search: false,
      write: false,
      research: false,
      canvas: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('activeTools', JSON.stringify(activeTools));
  }, [activeTools]);

  // Listen for localStorage changes from other components
  useEffect(() => {
    const checkLocalStorage = () => {
      const savedState = localStorage.getItem('activeTools');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setActiveTools(parsed);
        } catch (error) {
          console.error('Error parsing activeTools from localStorage', error);
        }
      }
    };
    
    // Check on mount
    checkLocalStorage();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLocalStorage);
    
    // Custom event for same-tab updates
    const handleCustomStorageEvent = () => checkLocalStorage();
    window.addEventListener('localStorageUpdated', handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('localStorageUpdated', handleCustomStorageEvent);
    };
  }, []);

  const [isListening, setIsListening] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [toolsMenuPosition, setToolsMenuPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const toolsMenuRef = useRef(null);
  const toolsButtonRef = useRef(null);
  const { hasReachedLimit } = usePromptCount();
  const { selectedModel } = useModel();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isToolsMenuOpen &&
        toolsMenuRef.current &&
        !toolsMenuRef.current.contains(event.target) &&
        toolsButtonRef.current &&
        !toolsButtonRef.current.contains(event.target)
      ) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isToolsMenuOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !hasReachedLimit) {
      onSendMessage(message, selectedModel.id);
      setMessage('');

      const updatedTools = {
        ...activeTools,
        search: false,
        write: false,
        research: false,
        canvas: false,
      };
      setActiveTools(updatedTools);
      localStorage.setItem('activeTools', JSON.stringify(updatedTools));
    }
  };

  // Commented out as it's currently unused
  // const toggleSpeechRecognition = () => {
  //   isListening ? stopListening() : startListening();
  // };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert('Speech recognition not supported in this browser.');

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    window.recognition = recognition;
  };

  const stopListening = () => {
    window.recognition?.stop();
    setIsListening(false);
  };

  const handlePlaceholderClick = () => {
    if (!disabled && !hasReachedLimit) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  return (
    <div className="pt-2 px-4 pb-4 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {activeTools.saveEarth && (
          <div className="flex items-center justify-between mb-3 px-4 py-3 rounded-2xl border border-green-100 bg-green-50">
            <div className="flex items-center">
              <PiLeaf className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Save Earth tool is on for energy-efficient prompting. Thank you for being environmentally conscious!
              </span>
            </div>
            <button
              className="text-xs text-green-500 hover:text-green-700"
              onClick={(e) => {
                e.preventDefault();
                const updatedTools = { ...activeTools, saveEarth: false };
                setActiveTools(updatedTools);
                localStorage.setItem('activeTools', JSON.stringify(updatedTools));
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="relative rounded-3xl border bg-white border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 cursor-text" onClick={handlePlaceholderClick}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything"
              disabled={disabled || hasReachedLimit}
              className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 p-0 m-0"
              rows="1"
              style={{ minHeight: '28px' }}
            />
          </div>

          <div className="flex items-center px-2 py-3">
            {/* Hidden file input */}
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={() => setIsToolsMenuOpen(false)}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            {/* Tools button */}
            <div className="relative">
              <button
                type="button"
                ref={toolsButtonRef}
                onClick={() => {
                  const rect = toolsButtonRef.current.getBoundingClientRect();
                  setToolsMenuPosition({
                    top: window.scrollY + rect.top - 10,
                    left: rect.left,
                  });
                  setIsToolsMenuOpen(!isToolsMenuOpen);
                }}
                className="flex items-center ml-2 text-gray-500 hover:text-gray-700"
                disabled={disabled || hasReachedLimit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {isToolsMenuOpen && (
                <div
                  ref={toolsMenuRef}
                  className="fixed w-64 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-200"
                  style={{ top: `${toolsMenuPosition.top}px`, left: `${toolsMenuPosition.left}px`, transform: 'translateY(-100%)', marginTop: '-10px' }}
                >
                  <div className="py-2">
                    <label htmlFor="file-upload" className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100 cursor-pointer">
                      <img src="/images/clip.png" alt="Upload files" className="mr-3 h-5 w-5" />
                      Add photos & files
                    </label>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100"
                      onClick={() => {
                        const updated = {
                          ...activeTools,
                          saveEarth: !activeTools.saveEarth,
                          search: false,
                          write: false,
                          research: false,
                          canvas: false,
                        };
                        setActiveTools(updated);
                        localStorage.setItem('activeTools', JSON.stringify(updated));
                        setIsToolsMenuOpen(false);
                      }}
                    >
                      <PiLeaf className="mr-3 h-5 w-5" />
                      Save Earth
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100">
                      <PiPaintBrushBroad className="mr-3 h-5 w-5" /> Create an image
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100">
                      <PiGlobe className="mr-3 h-5 w-5" /> Search the web
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100">
                      <PiPencilSimpleLine className="mr-3 h-5 w-5" /> Write or code
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-800 hover:bg-gray-100">
                      <PiBinoculars className="mr-3 h-5 w-5" /> Run deep research
                      <span className="ml-auto text-gray-400 text-xs">24 left</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-grow px-2"></div>


            {/* Send */}
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
      </form>
    </div>
  );
};

export default ChatInput;
