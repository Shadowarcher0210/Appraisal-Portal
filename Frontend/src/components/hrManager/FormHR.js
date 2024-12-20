import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  instructionsList,
  impInstructions,
} from "../manager/appraisalQuestions";
import Intro2 from "../Tabs/Intro2";
import { useLocation } from "react-router-dom";
import SelfAppraisal2 from "../Tabs/selfAppraisalTab";

const TABS = ["Introduction", "Self Appraisal"];

const FormHR = () => {
  const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
  
    const initialActiveTab = parseInt(queryParams.get("activeTab")) || 0;
  
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [selfAppraisalPage, setSelfAppraisalPage] = useState(0);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (activeTab === 1 && selfAppraisalPage === 0) {
      setSelfAppraisalPage(1);
    } else if (activeTab < TABS.length - 1) {
      setSelfAppraisalPage(0);
      // setCompletedSteps(Math.max(completedSteps, activeTab + 1));
      setActiveTab(activeTab + 1);
    }
  };


  

  const handlePreviousForm = () => {
    if (selfAppraisalPage > 0) {
      setSelfAppraisalPage(selfAppraisalPage - 1);
    } else if (activeTab > 0) {

      setActiveTab(activeTab - 1);
    } else if (activeTab === 0) {
      navigate("/hr-dashboard");
    }
  };

  return (
    <div className="flex h-auto max-w-full  mt-4">
      <div className="border p-4 w-full rounded shadow-lg ">

        {activeTab === 0 && (
          <Intro2
            handlePreviousForm={handlePreviousForm}
            handleContinue={handleContinue}
            instructionsList={instructionsList}
            impInstructions={impInstructions}
          />
        )}
        {activeTab === 1 && (
          <SelfAppraisal2
            selfAppraisalPage={selfAppraisalPage}
            handlePreviousForm={handlePreviousForm}
          />
        )}
      </div>
    </div>
  );
};

export default FormHR;