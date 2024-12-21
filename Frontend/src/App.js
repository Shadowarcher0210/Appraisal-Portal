import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.js';
import Login from './components/Login.js';
import Profile from './components/Profile.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import Dashboard from './components/employee/empDashboard.js';
import EmpViewPage from './components/employee/empViewPage.js';

import EmpForm from './components/employee/empForm.js';
import SelfAppraisal from './components/Tabs/SelfAppraisal2.js';
import Introduction from './components/Tabs/Intro2.js';
import M_Dashboard from './components/manager/M_Dashboard.js';
import M_Form from './components/manager/M_Form';
import M_ViewPage from './components/manager/M_ViewPage.js';
import EvaluationView from './components/Evaluation Pages/EvaluationView.js';
import FormHR from './components/hrManager/FormHR.js';
import DashboardHR from './components/hrManager/DashboardHR.js'
import MyPerformanceHR from './components/hrManager/MyPerformanceHR.js';
import PerformanceHR from './components/hrManager/PerformanceHR.js';
// import ViewHR from './components/hrManager/ViewHR.js';
import EvaluationView1 from './components/Evaluation Pages/EvaluationView1.js';
import EvaluationSummary from './components/manager/EvaluationSummary.js';
import EvaluationView2 from './components/Evaluation Pages/EvaluationView2.js';

import Self from './components/Tabs/selfAppraisalTab.js'
import EvaluationView3 from './components/Evaluation Pages/EvaluationView3.js';

import CEvaluation from './components/View Pages/CEvaluation.js';
import CEvaluation1 from './components/View Pages/CEvaluation1.js';
import CEvaluation2 from './components/View Pages/CEvaluation2.js';
import CEvaluation3 from './components/View Pages/CEvaluation3.js';
import CEvaluationSummary from './components/View Pages/CEvaluationSummary.js';
import TeamAppraisals from './components/manager/TeamAppraisals.js';
import M_PerformanceInsights from './components/manager/M_PerformanceInsights.js';
import EmployeeGoals from './components/manager/EmployeeGoals.js';
import PerformanceInsights from './components/employee/PerformanceInsights.js';

const App = () => {
  const location = useLocation();

 
  const hideNavAndHeader = location.pathname === '/' || 
                           location.pathname === '/forgotpassword' || 
                           location.pathname.startsWith('/resetPassword');

  return (
    <div className="flex">
      
      {/* {!hideNavAndHeader && <Leftnavbar />} */}
      
      <div className="flex-grow">
      
        {!hideNavAndHeader && <Header />}
        
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/profile' element={<Profile />} /> 
          <Route path='/forgotpassword' element={<ForgotPassword />} /> 
          <Route path='/resetPassword/:id/:token' element={<ResetPassword />} /> 
          <Route path="/form" element={<EmpForm />} />
          <Route path="/selfform" element={<SelfAppraisal/>} />
          <Route path="/intro" element={<Introduction/>} />

=
          <Route path="/empview/:employeeId" element={<EmpViewPage />} />

          <Route path="/employee-dashboard" element={<Dashboard />} />
          <Route path="/employee-performance" element={<PerformanceInsights />} />
          
          <Route path="/manager-dashboard" element={<M_Dashboard/>} />
          <Route path='/manager-performance' element={<TeamAppraisals/>}/>
          <Route path='/manager-my-performance' element={<M_PerformanceInsights/>}/>
          <Route path='/manager-Goals' element ={ < EmployeeGoals />}  />
          <Route path='/manager-Form' element ={<M_Form />} />
          <Route path='/manager-View' element ={<M_ViewPage />} />
          <Route path='/evaluationView/:employeeId' element ={<EvaluationView />} />

          {/* HR Manager */}
          <Route path='hr-dashboard' element={<DashboardHR/>}/>
          <Route path='hr-form' element={<FormHR/>}/>
          <Route path='hr-myperformance' element={<MyPerformanceHR/>}/>
          <Route path='hr-performance' element={<PerformanceHR/>}/>
          <Route path="/selfemp" element={<Self/>} />

          <Route path='/evaluationView1/:employeeId' element={<EvaluationView1 />} />
          <Route path='/evaluationView2/:employeeId' element={<EvaluationView2 />} />
          <Route path='/evaluationView3/:employeeId' element={<EvaluationView3 />} />
          <Route path='/evaluationSummary/:employeeId' element={<EvaluationSummary />} />


          <Route path='/CE/:employeeId' element={< CEvaluation />} />
          <Route path='/CE1/:employeeId' element={< CEvaluation1 />} />
          <Route path='/CE2/:employeeId' element={< CEvaluation2 />} />
          <Route path='/CE3/:employeeId' element={< CEvaluation3 />} />
          <Route path='/CES/:employeeId' element={< CEvaluationSummary />} />


          
     
        </Routes>
      </div>
    </div>
  );
};

export default App;
