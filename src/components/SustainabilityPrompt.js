import React, { useState } from 'react';

const SustainabilityPrompt = ({ promptCount, onSustainabilityAction, waitingForAction = false, waitingForEighthAction = false }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Handle user clicking Yes button
  const handleYesClick = () => {
    setShowInfo(true);
    onSustainabilityAction('yes');
  };

  // Handle user clicking No button
  const handleNoClick = () => {
    onSustainabilityAction('no');
  };

  // Handle user clicking Cancel (X) button
  const handleCancelClick = () => {
    onSustainabilityAction('cancel');
  };
  
  // Handle 8th message Yes button
  const handleEighthYesClick = () => {
    onSustainabilityAction('eighth-yes');
  };
  
  // Handle 8th message No button
  const handleEighthNoClick = () => {
    onSustainabilityAction('eighth-no');
  };
  
  // Handle Continue button click
  const handleContinueClick = () => {
    onSustainabilityAction('continue');
  };

  if (promptCount === 3 && waitingForAction) {
    return (
      <div className="sustainability-prompt bg-yellow-50 border-l-4 border-green-500 text-sm text-gray-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-start">
          <p className="mb-2">
            🌱 Hey, did you know this prompt would emit around <strong>4g of CO₂</strong> and use <strong>10mL of water</strong>? Would you like to learn more about energy-efficient prompting?
          </p>
          <button 
            onClick={handleCancelClick} 
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {!showInfo ? (
          <div className="flex gap-4">
            <button onClick={handleYesClick} className="px-3 py-1 bg-green-600 text-white rounded">Yes</button>
            <button onClick={handleNoClick} className="px-3 py-1 border border-gray-400 rounded">No</button>
          </div>
        ) : (
          <>
            <div className="mt-4 bg-white p-3 border border-gray-200 rounded shadow">
              <p className="font-semibold mb-2">💡 Energy-Efficient Prompting Tips:</p>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li><strong>❌ Vague:</strong> "Tell me about marketing"</li>
                <li><strong>✅ Better:</strong> "Summarize 3 trends in digital marketing for 2024"</li>
                <li><strong>✅ Better:</strong> "Give me 3 bullet points about Gen Z brand loyalty"</li>
              </ul>
            </div>
            <div className="mt-3 flex justify-end gap-3">
              <button 
                onClick={() => onSustainabilityAction('reword')} 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reword Prompt?
              </button>
              <button 
                onClick={handleContinueClick} 
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (promptCount === 8 && waitingForEighthAction) {
    return (
      <div className="sustainability-prompt bg-red-50 border-l-4 border-red-500 text-sm text-red-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-start">
          <p className="mb-2">
            🔋 Whoa there! This prompt uses more energy than a <strong>Google search</strong>, and you've passed the average daily prompts. Mind taking a break?
          </p>
          <button 
            onClick={handleEighthNoClick} 
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex gap-4">
          <button onClick={handleEighthYesClick} className="px-3 py-1 bg-green-600 text-white rounded">Yes</button>
          <button onClick={handleEighthNoClick} className="px-3 py-1 border border-gray-400 rounded">No</button>
        </div>
      </div>
    );
  }

  return null;
};

export default SustainabilityPrompt;
