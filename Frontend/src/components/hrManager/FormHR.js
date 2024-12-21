import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  instructionsList,
  impInstructions,
} from "../manager/MangerAppraisalQuestions";
import Intro2 from "../Tabs/Intro2";
import { useLocation } from "react-router-dom";
import SelfAppraisal from "../Tabs/SelfAppraisalTab";

const TABS = ["Introduction", "Self Appraisal"];

const FormHR = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selfAppraisalPage, setSelfAppraisalPage] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token')
  const { timePeriod } = location.state || {}

  const handleContinue = () => {
    if (activeTab === 1 && selfAppraisalPage === 0) {
      setSelfAppraisalPage(1);
    } else if (activeTab < TABS.length - 1) {
      setSelfAppraisalPage(0);
      // setCompletedSteps(Math.max(completedSteps, activeTab + 1));
      setActiveTab(activeTab + 1);
    }
  };


  const handleSave = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
     
      const response = await fetch(`http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`, {
        method: 'PUT',
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // body: JSON.stringify({ pageData }),
        status: "In Progress"
      })


      if (response.ok) {
        console.log('response', response);
        const data = await response.json();
        console.log("data", data);
        navigate("/manager-dashboard");

      } else {
        const errorData = await response.json();

      }
    }

    catch {
      if (activeTab === 1) {
        setSelfAppraisalPage(1);
      }
    }
  }

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
          <SelfAppraisal
            selfAppraisalPage={selfAppraisalPage}
            handlePreviousForm={handlePreviousForm}
          />
        )}
      </div>
    </div>
  );
};

export default FormHR;