import React from 'react';

const IntroductionTab = ({ handlePreviousForm, handleContinue, instructionsList, impInstructions }) => {
  return (
    <div className="relative flex flex-col px-6 py-4 bg-gray-50 rounded-lg shadow-md overflow-y-auto" style={{maxHeight: "550px", scrollbarWidth:"thin"}}>
      <div>
      <h1 className="text-4xl font-bold text-orange-500 mb-4">Introduction</h1>
      <p className="text-gray-700 mb-6">
        Welcome to the Employee Appraisal Process! Below you'll find
        detailed instructions and FAQs to help you navigate through the
        steps smoothly.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Steps to Follow:</h2>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        {instructionsList.map((list, index) => (
          <li key={index} className="flex items-start mb-2">
            <span className="mr-2 text-orange-400 text-lg">≫</span>
            <span>{list}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">FAQs:</h2>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        {impInstructions.map((list, index) => (
          <li key={index} className="flex items-start mb-2">
            <span className="mr-2 text-orange-400 text-lg">≫</span>
            <span>{list}</span>
          </li>
        ))}
      </ul>
      </div>
      <div className="sticky bottom-0 bg-gray-50 py-2  flex justify-between items-center space-x-2  border-gray-300">
        <button
          className="bg-orange-400 hover:bg-orange-500 transition duration-300 text-white font-semibold py-2 px-6 rounded-lg"
          onClick={handlePreviousForm}
        >
          Back
        </button>
        <button
          className="bg-orange-400 hover:bg-orange-500 transition duration-300 text-white font-semibold py-2 px-6 rounded-lg"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default IntroductionTab;