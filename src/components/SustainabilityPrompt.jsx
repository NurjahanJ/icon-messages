import React, { useState } from 'react';
import { useStoreInfoPromptResponse } from '../services/sustainabilityService';
import { useStoreInfoMessageChoice, useStoreRewordChoice, useStoreBreakMessageChoice } from '../services/messageOneService';

const SustainabilityPrompt = ({ promptCount, onSustainabilityAction, waitingForAction = false, waitingForEighthAction = false, userId }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const storeInfoPromptResponse = useStoreInfoPromptResponse();
  const storeInfoMessageChoice = useStoreInfoMessageChoice();
  const storeRewordChoice = useStoreRewordChoice();
  const storeBreakMessageChoice = useStoreBreakMessageChoice();

  // Handle user clicking Yes button
  const handleYesClick = () => {
    setShowInfo(true);
    onSustainabilityAction('yes');
    // Store the 'yes' response in messages_info table
    storeInfoPromptResponse('yes')
      .then(id => console.log('Stored yes response with ID:', id))
      .catch(err => console.error('Error storing yes response:', err));
    
    // Also store in the new message-one table
    storeInfoMessageChoice('yes')
      .then(id => {
        console.log('Stored yes choice in message_one with ID:', id);
        setMessageId(id);
      })
      .catch(err => console.error('Error storing yes choice in message_one:', err));
  };

  // Handle user clicking No button
  const handleNoClick = () => {
    onSustainabilityAction('no');
    // Store the 'no' response in messages_info table
    storeInfoPromptResponse('no')
      .then(id => console.log('Stored no response with ID:', id))
      .catch(err => console.error('Error storing no response:', err));
    
    // Also store in the new message-one table
    storeInfoMessageChoice('no')
      .then(id => {
        console.log('Stored no choice in message_one with ID:', id);
        setMessageId(id);
      })
      .catch(err => console.error('Error storing no choice in message_one:', err));
  };

  // Handle user clicking Cancel (X) button
  const handleCancelClick = () => {
    onSustainabilityAction('cancel');
  };
  
  // Handle 8th message Yes button (take a break)
  const handleEighthYesClick = () => {
    onSustainabilityAction('eighth-yes', userId);
    
    // Store the break choice in message_one table
    storeBreakMessageChoice('break', messageId)
      .then(id => console.log('Stored break choice in message_one with ID:', id))
      .catch(err => console.error('Error storing break choice in message_one:', err));
  };
  
  // Handle 8th message No button (continue)
  const handleEighthNoClick = () => {
    onSustainabilityAction('eighth-no');
    
    // Store the continue choice in message_one table
    storeBreakMessageChoice('continue', messageId)
      .then(id => console.log('Stored continue choice in message_one with ID:', id))
      .catch(err => console.error('Error storing continue choice in message_one:', err));
  };
  
  // Handle Continue button click
  const handleContinueClick = () => {
    onSustainabilityAction('continue');
    
    // Store the continue choice in message_one table
    storeRewordChoice('continue', messageId)
      .then(id => console.log('Stored continue choice in message_one with ID:', id))
      .catch(err => console.error('Error storing continue choice in message_one:', err));
  };

  if (promptCount === 3 && waitingForAction) {
    return (
      <div className="sustainability-prompt bg-yellow-50 border-l-4 border-green-500 text-sm text-gray-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-start">
          <p className="mb-2">
            <img src="/images/leaf-svg.svg" alt="leaf" style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} /> Hey, did you know this prompt could emit about <strong>0.19g of CO₂</strong> and use <strong>50mL of water</strong>? Would you like to learn about energy-efficient prompting?
          </p>
          <button 
            onClick={handleCancelClick} 
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {!showInfo ? (
          <div className="flex justify-end gap-4">
            <button onClick={handleNoClick} className="px-3 py-1 border border-gray-400 rounded">No</button>
            <button onClick={handleYesClick} className="px-3 py-1 bg-green-600 text-white rounded">Yes</button>
          </div>
        ) : (
          <>
            <div className="mt-4 bg-white p-3 border border-gray-200 rounded shadow">
              <p className="font-semibold mb-2">💡 Energy-Efficient Prompting Tips:</p>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li><strong>❌ Vague:</strong> "Tell me everything you know about digital marketing"</li>
                <li><strong>✅ Specific:</strong> "Summarize 3 trends in digital marketing for 2024"</li>
                <li><strong>✅ Combined:</strong> "What are the key benefits of digital marketing, and how does social media influence digital marketing strategies?"</li>
              </ul>
            </div>
            <div className="mt-3 flex justify-end gap-3">
              <button 
                onClick={handleContinueClick} 
                className="px-3 py-1 border border-gray-400 rounded"
              >
                Continue
              </button>
              <button 
                onClick={() => {
                  onSustainabilityAction('reword');
                  // Store the reword choice in message_one table
                  storeRewordChoice('reword', messageId)
                    .then(id => console.log('Stored reword choice in message_one with ID:', id))
                    .catch(err => console.error('Error storing reword choice in message_one:', err));
                }} 
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Reword Prompt?
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (Math.floor(promptCount) === 6 && waitingForEighthAction) {
    return (
      <div className="sustainability-prompt bg-red-50 border-l-4 border-red-500 text-sm text-red-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-start">
          <p className="mb-2">
            🔋 Whoa there! GenAI prompts use more energy than a typical web search, and you're about to pass the average ChatGPT daily prompts! How about taking a little break?
          </p>
          <button 
            onClick={handleEighthNoClick} 
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex justify-end gap-4">
          <button onClick={handleEighthNoClick} className="px-3 py-1 border border-gray-400 rounded">Continue</button>
          <button onClick={handleEighthYesClick} className="px-3 py-1 bg-green-600 text-white rounded">I can use a break!</button>
        </div>
      </div>
    );
  }

  return null;
};

export default SustainabilityPrompt;
