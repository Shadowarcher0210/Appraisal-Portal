export const getAttainmentText = (weight) => {
  if (weight === 100) return '100%';
  if (weight >= 80) return '80%';
  if (weight >= 60) return '60%';
  if (weight >= 40) return '40%';
  if (weight >= 20) return '20%';
  return '0 %';
};
export const getAttainmentColor = (weight) => {
  if (weight >= 80) return 'bg-orange-100 text-orange-800';
  if (weight >= 60) return 'bg-blue-100 text-blue-800';
  if (weight >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getAnswerFromWeight = (weight) => {
    switch (weight) {
      case 20:
        return "Strongly Disagree";
      case 40:
        return "Somewhat Disagree";
      case 60:
        return "Agree";
      case 80:
        return "Somewhat Agree";
      case 100:
        return "Strongly Agree";
      default:
        return "No Response";
    }
  };
  
  export const createPageData = (weights, notes) => [
    {
      questionId: 1,
      question: "Job-Specific Knowledge: I possess and apply the expertise, experience, and background to achieve solid results.",
      answer: getAnswerFromWeight(weights[0]),
      notes: notes[0],
      weights: weights[0],
    },
    {
      questionId: 2,
      question: "Team-work: I work effectively and efficiently with the team.",
      answer: getAnswerFromWeight(weights[1]),
      notes: notes[1],
      weights: weights[1],
    },
    {
      questionId: 3,
      question: "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
      answer: getAnswerFromWeight(weights[2]),
      notes: notes[2],
      weights: weights[2],
    },
    {
      questionId: 4,
      question: "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
      answer: getAnswerFromWeight(weights[3]),
      notes: notes[3],
      weights: weights[3],
    },
    {
      questionId: 5,
      question: "Leadership: I like to take responsibility in managing the team.",
      answer: getAnswerFromWeight(weights[4]),
      notes: notes[4],
      weights: weights[4],
    },
    {
      questionId: 6,
      question: "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
      answer: getAnswerFromWeight(weights[5]),
      notes: notes[5],
      weights: weights[5],
    },
    {
      questionId: 7,
      question: "Communication: I convey my thoughts clearly and respectfully.",
      answer: getAnswerFromWeight(weights[6]),
      notes: notes[6],
      weights: weights[6],
    },
    {
      questionId: 8,
      question: "Time Management: I complete my tasks on time.",
      answer: getAnswerFromWeight(weights[7]),
      notes: notes[7],
      weights: weights[7],
    },
    {
      questionId: 9,
      question: "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
      answer: getAnswerFromWeight(weights[8]),
      notes: notes[8],
      weights: weights[8],
    },
    {
      questionId: 10,
      question: "Creativity: I look for solutions outside the work.",
      answer: getAnswerFromWeight(weights[9]),
      notes: notes[9],
      weights: weights[9],
    },
    {
      questionId: 11,
      question: "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
      answer: getAnswerFromWeight(weights[10]),
      notes: notes[10],
      weights: weights[10],
    },
    {
      questionId: 12,
      question: "Client Interaction: I take the initiative to help shape events that will lead to the organization’s success and showcase it to clients.",
      answer: getAnswerFromWeight(weights[11]),
      notes: notes[11],
      weights: weights[11],
    },
    {
      questionId: 13,
      question: "Software Development: I am committed to improving my knowledge and skills.",
      answer: getAnswerFromWeight(weights[12]),
      notes: notes[12],
      weights: weights[12],
    },
    {
      questionId: 14,
      question: "Growth: I am proactive in identifying areas for self-development.",
      answer: getAnswerFromWeight(weights[13]),
      notes: notes[13],
      weights: weights[13],
    },
  ];

  