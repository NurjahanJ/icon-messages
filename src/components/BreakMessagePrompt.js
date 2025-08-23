import React from 'react';
import { useStoreBreakMessageResponse } from '../services/breakMessageService';

/**
 * Component that displays a prompt asking users to take a break
 * when they've reached a high number of prompts
 */
const BreakMessagePrompt = ({ onClose }) => {
  const storeBreakMessageResponse = useStoreBreakMessageResponse();

  // Handle user clicking Continue button
  const handleContinueClick = () => {
    storeBreakMessageResponse('continue')
      .then(id => console.log('Stored continue response with ID:', id))
      .catch(err => console.error('Error storing continue response:', err));
    
    if (onClose) onClose('continue');
  };

  // Handle user clicking "I can use a break!" button
  const handleBreakClick = () => {
    storeBreakMessageResponse('break')
      .then(id => console.log('Stored break response with ID:', id))
      .catch(err => console.error('Error storing break response:', err));
    
    if (onClose) onClose('break');
  };

  // Handle user clicking the X button
  const handleCloseClick = () => {
    if (onClose) onClose('close');
  };

  return (
    <div className="sustainability-prompt bg-red-50 border-l-4 border-red-500 text-sm text-red-800 p-4 rounded-md my-4">
      <div className="flex justify-between items-start">
        <p className="mb-2">
          🔋 Whoa there! GenAI prompts use more energy than a typical web search, and you're about to pass the average ChatGPT daily prompts! How about taking a little break?
        </p>
        <button 
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={handleCloseClick}
        >
          ✕
        </button>
      </div>
      <div className="flex justify-end gap-4">
        <button 
          className="px-3 py-1 border border-gray-400 rounded"
          onClick={handleContinueClick}
        >
          Continue
        </button>
        <button 
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={handleBreakClick}
        >
          I can use a break!
        </button>
      </div>
    </div>
  );
};

export default BreakMessagePrompt;
