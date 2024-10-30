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
     
        </Routes>
      </div>
    </div>
  );
};

export default App;
