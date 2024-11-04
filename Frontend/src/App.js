import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Viewallappraisals from './components/Viewallappraisals.js';
import ConfigureAppraisalForms from './components/hrManager/ConfigureAppraisalForms.js'; 
import Header from './components/Header.js';
import Leftnavbar from './components/Leftnavbar.js';
import PerformancePage from './components/employee/empPerformance.js';
import Login from './components/Login.js';
import Profile from './components/Profile.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import Dashboard from './components/employee/empDashboard.js';
import EmpViewPage from './components/employee/empViewPage.js';

import EmpForm from './components/employee/empForm.js';
import SelfAppraisal from './components/Tabs/SelfAppraisal2.js';
import Introduction from './components/Tabs/Intro2.js';
import Goals from './components/Tabs/Goals.js';
import M_Dashboard from './components/manager/M_Dashboard.js';
import M_Performance from './components/manager/M_Performance.js';
import M_myPerformance from './components/manager/M_myPerformance.js';

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
          <Route path="/viewallappraisals" element={<Viewallappraisals />} />
          <Route path="/form" element={<EmpForm />} />
          <Route path="/selfform" element={<SelfAppraisal/>} />
          <Route path="/intro" element={<Introduction/>} />

          <Route path="/goals2" element={<Goals/>} />

          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/configure-appraisal-forms" element={<ConfigureAppraisalForms />} />
          <Route path="/empview" element={<EmpViewPage />} />

          <Route path="/employee-dashboard" element={<Dashboard />} />
          <Route path="/employee-performance" element={<empPerformance />} />
          {/* Manager */}
          <Route path="/manager-dashboard" element={<M_Dashboard/>} />
          <Route path='/manager-performance' element={<M_Performance/>}/>
          <Route path='/manager-my-performance' element={<M_myPerformance/>}/>
          
          
     
        </Routes>
      </div>
    </div>
  );
};

export default App;
