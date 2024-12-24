export const getAttainmentStyle = (attainment) => {
    if (attainment === "N/A") return "bg-blue-50 text-blue-300";
    const value = parseFloat(attainment);
    if (value >= 80) return "bg-green-100 text-green-800";
    if (value >= 50) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };
  
  export const createTableData = (selfAssessment, managerRating, goalsOverall, additionalAreasOverall, overallWeightage) => {
    return [
      {
        id: 1,
        category: "Employee Self Appraisal",
        weightage: "10%",
        attainment: selfAssessment || "N/A",
      },
      {
        id: 2,
        category: "Manager Assessment",
        weightage: "30%",
        attainment: managerRating || "N/A",
      },
      {
        id: 3,
        category: "Employee Goals",
        weightage: "35%",
        attainment: goalsOverall || "N/A",
      },
      {
        id: 4,
        category: "Additional Areas of Assessment",
        weightage: "25%",
        attainment: additionalAreasOverall || "N/A",
      },
      {
        id: 5,
        category: "Overall Weightage",
        weightage: "100%",
        attainment: overallWeightage || "N/A",
      },
    ];
  };
  
  export const initialTableData = [
    {
      id: 1,
      category: "Employee Self Appraisal",
      weightage: "10%",
      attainment: "",
    },
    {
        id: 2,
        category: "Manager Assessment",
        weightage: "30%",
        attainment: "",
      },
    {
      id: 3,
      category: "Employee Goals",
      weightage: "35%",
      attainment: "",
    },
    {
      id: 4,
      category: "Additional Areas of Assessment",
      weightage: "25%",
      attainment: "",
    },
    {
      id: 5,
      category: "Overall Weightage",
      weightage: "100%",
      attainment: "",
    },
  ];