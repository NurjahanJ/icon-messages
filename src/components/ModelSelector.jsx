import React, { useRef, useEffect } from 'react';
import { useModel } from '../contexts/ModelContext';

const ModelSelector = () => {
  const { models, selectedModel, selectModel, isModelMenuOpen, toggleModelMenu, closeModelMenu } = useModel();
  const menuRef = useRef(null);
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeModelMenu();
      }
    };

    if (isModelMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModelMenuOpen, closeModelMenu]);

  return (
    <div className="relative">
      {/* Dropdown toggle button */}
      <div 
        onClick={toggleModelMenu}
        className="cursor-pointer rounded-lg transition-colors duration-200 hover:bg-gray-100"
      >
        <div className="flex items-center px-3 py-1.5">
          <h1 className="text-base">
            {selectedModel.id === 'gpt-4o' ? (
              <>
                <span className="text-black font-medium">ChatGPT</span>
                <span className="text-gray-500 font-medium"> 4o</span>
              </>
            ) : (
              <span className="text-gray-500 font-medium">{selectedModel.name}</span>
            )}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ml-1 inline-block text-gray-500 transition-transform duration-200 ${isModelMenuOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </h1>
        </div>
      </div>

      {/* Dropdown menu */}
      {isModelMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4">
            <div className="text-sm text-gray-500 flex items-center mb-3">
              Models
              <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="currentColor" />
                <path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z" fill="currentColor" />
                <path d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z" fill="currentColor" />
              </svg>
            </div>
            
            <div className="space-y-3">
              {models.map((model) => (
                <div 
                  key={model.id}
                  onClick={() => selectModel(model)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedModel.id === model.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <div>
                    <div className="font-medium text-gray-800">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.description}</div>
                  </div>
                  {selectedModel.id === model.id && (
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-50">
                <span>More models</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
