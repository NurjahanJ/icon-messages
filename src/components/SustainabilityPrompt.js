import React, { useState } from 'react';

const SustainabilityPrompt = ({ promptCount }) => {
  const [showInfo, setShowInfo] = useState(false);

  if (promptCount === 3) {
    return (
      <div className="bg-yellow-50 border-l-4 border-green-500 text-sm text-gray-800 p-4 rounded-md my-4">
        <p className="mb-2">
          🌱 Hey, did you know this prompt would emit around <strong>4g of CO₂</strong> and use <strong>10mL of water</strong>? Would you like to learn more about energy-efficient prompting?
        </p>
        <div className="flex gap-4">
          <button onClick={() => setShowInfo(true)} className="px-3 py-1 bg-green-600 text-white rounded">Yes</button>
          <button className="px-3 py-1 border border-gray-400 rounded">No</button>
        </div>
        {showInfo && (
          <div className="mt-4 bg-white p-3 border border-gray-200 rounded shadow">
            <p className="font-semibold mb-2">💡 Energy-Efficient Prompting Tips:</p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><strong>❌ Vague:</strong> “Tell me about marketing”</li>
              <li><strong>✅ Better:</strong> “Summarize 3 trends in digital marketing for 2024”</li>
              <li><strong>✅ Better:</strong> “Give me 3 bullet points about Gen Z brand loyalty”</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (promptCount === 8) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-sm text-red-800 p-4 rounded-md my-4">
        🔋 Whoa there! This prompt uses more energy than a <strong>Google search</strong>, and you’ve passed the average daily prompts. Mind taking a short break?
      </div>
    );
  }

  return null;
};

export default SustainabilityPrompt;
