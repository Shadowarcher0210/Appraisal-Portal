const data = {
  instructionsList: [
    "You fill your appraisal and submit to your manager.",
    "Your manager fills their comments and ratings for your appraisal and submits to HR.",
    "HR finalizes your appraisal.",
    "Your manager discusses the appraisal with you and submits for your acceptance.",
    "You accept the appraisal to close the process for this year.",
  ],
  impInstructions: [
    "Is it mandatory to provide ratings and comments for all competencies and goals in the appraisal forms? A1. Yes, it is mandatory to provide ratings and comments for all competencies in the Competency Form and for goals in the Goal Sheet form. These ratings help you define your achievements and assist your manager in entering the necessary ratings and comments during the appraisal process."
    ,
    "Should I review all forms before filling them out? A2. Yes, it is a good practice to go through all the forms to understand what data needs to be filled in. This will ensure you have all the necessary information ready.",
    "Can I complete the appraisal forms in multiple sittings? A3. Yes, you can complete the appraisal forms in multiple sittings by clicking on the Save & Exit button. However, it may be beneficial to collect all relevant details before you start filling out the forms to streamline the process.",
  ],

  questionsAndAnswers: [
    { question: "Adaptability", answer: "I am very adaptable." },
    { question: "Collaboration", answer: "I work well with others." },
    { question: "Problem Solving", answer: "I solve problems efficiently." },
    { question: "Communication", answer: "I communicate effectively." },
    { question: "Leadership", answer: "I take initiative in team projects." },
    { question: "Technical Skills", answer: "I excel at coding." },
    { question: "Time Management", answer: "I manage time effectively." },
    { question: "Teamwork", answer: "I value teamwork and cooperation." },
    { question: "Creativity", answer: "I think outside the box." },
    { question: "Client Interaction", answer: "I engage well with clients." },
  ],
  goalsResponse: [
    {
      question: "Performance Improvement",
      answer: "Implemented time management techniques to boost my productivity.",
    },
    {
      question: "Skill Development",
      answer: "Pursued a project management certification that enhanced my planning and organizational skills.",
    },
    {
      question: "Collaboration and Teamwork",
      answer: "Worked closely with colleagues on a cross-departmental project, leading to improved outcomes.",
    },
    {
      question: "Leadership and Initiative",
      answer: "Led a team initiative that increased project efficiency and fostered teamwork.",
    },
    {
      question: "Customer Satisfaction",
      answer: "Actively sought customer feedback and made adjustments to improve service quality.",
    },
    {
      question: "Project Management",
      answer: "Successfully managed the launch of a new product by coordinating with various stakeholders.",
    },
    {
      question: "Work-Life Balance",
      answer: "Established clear boundaries for work hours, allowing time for personal activities and relaxation.",
    },
    {
      question: "Innovation and Creativity",
      answer: "Introduced a new workflow process that streamlined operations and reduced turnaround time.",
    },
  ],
   questionsAndAnswersEmployee : [
    { question: 'Job-Specific Knowledge', answer: 'I possess and apply the expertise, experience, and background to achieve solid results.' },
    { question: 'Team Work', answer: 'I work effectively and efficiently with team.' },
    { question: 'Job-Specific Skills', answer: 'I demonstrate the aptitude and competence to carry out my job responsibilities.' },
    { question: 'Adaptability', answer: 'I am flexible and receptive regarding new ideas and approaches.' },
    { question: 'Leadership', answer: 'I like to take responsibility in managing the team.' },
    { question: 'Collaboration', answer: 'I cultivate positive relationships. I am willing to learn from others.' },
    { question: 'Communication', answer: 'I convey my thoughts clearly and respectfully.' },
    { question: 'Time Management', answer: 'I complete my tasks on time. ' },
    { question: 'Results', answer: ' I identify goals that are aligned with the organizations strategic direction and achieve results accordingly.' },
    { question: 'Creativity', answer: 'I look for solutions outside the work.' },
    { question: 'Initiative', answer: 'I anticipate needs, solve problems, and take action, all without explicit instructions.' },
    { question: 'Client Interaction', answer: 'I take the initiative to help shape events that will lead to the organizations success and showcase it to clients.' },
    { question: 'Software Development', answer: 'I am committed to improving my knowledge and skills.' },
    { question: 'Growth', answer: 'I am proactive in identifying areas for self-development.' },
  ],
  generalQuestions : [
    "Job-Specific Knowledge: I possess and apply the expertise, experience, and background to achieve solid results.",
    "Team-work: I work effectively and efficiently with team.",
    "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
  ],
  competencyQuestions : [
    "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
    "Leadership: I like to take responsibility in managing the team.",
    "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
    "Communication: I convey my thoughts clearly and respectfully.",
    "Time Management: I complete my tasks on time.",
    "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
    "Creativity: I look for solutions outside the work.",
    "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
    "Client Interaction: I take the initiative to help shape events that will lead to the organization’s success and showcase it to clients.",
    "Software Development: I am committed to improving my knowledge and skills.",
    "Growth: I am proactive in identifying areas for self-development.",
  ],
};

export default data;
export const { instructionsList, impInstructions, questionsAndAnswers, goalsResponse, questionsAndAnswersEmployee,  generalQuestions , competencyQuestions} = data;
