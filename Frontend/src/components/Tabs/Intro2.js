import React from 'react';
import { instructionsList } from '../employee/EmpAppraisalQuestions';
const Introduction = ({ 
  handlePreviousForm, 
  handleContinue, 
  impInstructions = [
    "Is it mandatory to provide ratings and comments for all competencies and goals in the appraisal forms? \n A1. Yes, it is mandatory to provide ratings and comments for all competencies in the Competency Form and for goals in the Goal Sheet form. These ratings help you define your achievements and assist your manager in entering the necessary ratings and comments during the appraisal process.",
    "Should I review all forms before filling them out? <br/> A2. Yes, it is a good practice to go through all the forms to understand what data needs to be filled in. This will ensure you have all the necessary information ready.",
    "Can I complete the appraisal forms in multiple sittings? \n A3. Yes, you can complete the appraisal forms in multiple sittings by clicking on the Save & Exit button. However, it may be beneficial to collect all relevant details before you start filling out the forms to streamline the process."
  ]
}) => {
  return (
    <div className=" flex flex-col ">
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-8 rounded-lg mb-3 shadow-lg mt-10 ">
        <h1 className="text-3xl font-bold mb-4">Welcome to Employee Appraisal</h1>
        <p className="text-white text-lg">
          We're here to guide you through the Employee Appraisal Process. Follow the instructions below to complete your assessment effectively.
        </p>
      </div>

      <div className="mb-16">
        <div className="">
          <div className="space-y-6">
            {/* Steps Section */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Steps to Follow
              </h2>
              <ul className="space-y-3">
                {instructionsList.map((list, index) => (
                  <li key={index} className="flex items-start group hover:bg-white p-2 rounded-lg transition-colors">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{list}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Section */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-5 rounded-lg">
              <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frequently Asked Questions
              </h2>
              <ul className="space-y-3">
                {impInstructions.map((list, index) => (
                  <li key={index} className="flex items-start group hover:bg-white p-2 rounded-lg transition-colors">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      Q
                    </span>
                    <span className="text-gray-700">{list}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-between space-x-4 border-t px-6 py-4">
      <button
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          onClick={handlePreviousForm}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          onClick={handleContinue}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Introduction;