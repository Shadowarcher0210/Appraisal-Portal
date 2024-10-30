import React from 'react';

const GoalsTab = ({
  goalsResponse,
  goalAnswers,
  handleGoalChange,
  handlePreviousForm,
  handleSubmit,
}) => {
  return (
    <div className="relative h-full flex flex-col overflow-y-auto max-h-[550px] scroll-th">
      <h1 className="font-semibold font-serif text-left text-2xl text-gray-600">
        Goals
      </h1>
      <p> Please add your goals for the next consequtive year. </p>
      <div className="mt-4 flex-1">
        {goalsResponse.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-lg p-4 mb-4 bg-white"
          >
            <h2 className="font-semibold mb-2">{item.question}</h2>
            <textarea
              className="w-full h-24 border border-gray-300 rounded p-2 mt-2 resize-none"
              placeholder="Type your answer here..."
              value={goalAnswers[index].answer}
              onChange={(e) => handleGoalChange(index, e.target.value)}
            ></textarea>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 bg-white py-4 flex justify-end space-x-2">
        <button
          className="bg-orange-400 hover:bg-orange-500 rounded-lg p-2 text-white px-4 mr-auto"
          onClick={handlePreviousForm}
        >
          Back
        </button>
        <button
          className="bg-orange-400 hover:bg-orange-500 rounded-lg p-2 text-white px-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default GoalsTab;