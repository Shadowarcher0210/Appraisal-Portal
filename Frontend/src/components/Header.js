import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import nothing from '../assets/nothing.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
  const [appraisalNotification, setAppraisalNotification] = useState(null);
  const [GoalNotification, setGoalNotification] = useState(null);
  const [submitNotification, setSubmitNotification] = useState(null);
  const [notiStartsNotification, setNotiStartsNotification] = useState(null);
  const [managerNotification, setManagerNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [seenNotifications, setSeenNotifications] = useState(() => {
    const saved = localStorage.getItem('seenNotifications');
    return saved ? JSON.parse(saved) : {};
  });

  const empType = localStorage.getItem('empType');
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const userRef = useRef(null);
  const employeeName = localStorage.getItem('empName');
  const designation = localStorage.getItem('designation');
  const employeeId = localStorage.getItem('employeeId');
  const GoalStatus = localStorage.getItem('GoalStatus');

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotificationDropdown(false);
    }
    if (userRef.current && !userRef.current.contains(event.target)) {
      setShowUserDropdown(false);
    }
  };
  const handleMyProfie = () => {
    navigate('/profile');
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleTabClick = (tabName, path) => {
        setActiveTab(tabName);
        localStorage.setItem('activeTab', tabName);
        navigate(path);
      };

  const compareNotifications = (current, seen) => {
    if (empType === 'Manager') {
      const currentMessages = current?.managerNotification || [];
      return currentMessages.some(msg => !seen[msg]);
    } else {
      const notifications = {
        appraisal: current?.appraisalNotification,
        submit: current?.submitNotification,
        notiStarts: current?.notiStartsNotification
      };
      
      return Object.entries(notifications).some(([key, value]) => 
        value && (!seen[key] || seen[key] !== value)
      );
    }
  };

  const updateSeenNotifications = (currentNotifications) => {
    const newSeen = { ...seenNotifications };
    
    if (empType === 'Manager') {
      currentNotifications?.managerNotification?.forEach(msg => {
        newSeen[msg] = true;
      });
    } else {
      if (currentNotifications.appraisalNotification) {
        newSeen.appraisal = currentNotifications.appraisalNotification;
      }
      if (currentNotifications.submitNotification) {
        newSeen.submit = currentNotifications.submitNotification;
      }
      if (currentNotifications.notiStartsNotification) {
        newSeen.notiStarts = currentNotifications.notiStartsNotification;
      }
      if(currentNotifications.GoalNotification){
        newSeen.notifyGoalsResponse = currentNotifications.notifyGoalsResponse
      }
    }

    setSeenNotifications(newSeen);
    localStorage.setItem('seenNotifications', JSON.stringify(newSeen));
  };

  

  const fetchNotifications = async () => {
    const startDate = localStorage.getItem('initiatedOn') || new Date().toISOString().split('T')[0];
  
    if (!employeeId) {
      console.warn('No employeeId found in localStorage');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
  
  
  try {
    let currentNotifications = {
      managerNotifications: {},
      employeeNotifications: {
        submitNotification: '',
        goalNotification: '',
        appraisalNotification: '',
        notiStartsNotification: ''
      }
    };
  
    if (empType === 'Manager') {
      const managerName = localStorage.getItem('empName');
      try {
        const notifyManagerResponse = await axios.get(`http://localhost:3003/form/notify/${managerName}`);
        const notifications = notifyManagerResponse.data.notifications;
        setManagerNotification(notifications.map(notification => notification.message));
        currentNotifications.managerNotifications = notifications.map(notification => notification.message);
        console.log("Manager Notifications:", currentNotifications.managerNotifications);
      } catch (error) {
        console.error("Error fetching manager notifications:", error);
      }
    } else if (empType === "Employee") {
      try {
        const managerName = localStorage.getItem('managerName');
        console.log('Fetching employee notifications for:', managerName);
  
        const responses = await Promise.all([
          axios.get(`http://localhost:3003/form/expiry/${employeeId}/${startDate}`).catch(error => error), 
          axios.get(`http://localhost:3003/form/getNotiStarts/${employeeId}`).catch(error => error),
          axios.get(`http://localhost:3003/form/getNotification/${employeeId}/${startDate}`).catch(error => error),
          axios.get(`http://localhost:3003/form/notifyGoals/${employeeId}/${managerName}`).catch(error => error)
        ]);
  
        const [expiryResponse, notiStartsResponse, submitResponse, notifyGoalsResponse] = responses;
  
        if (expiryResponse instanceof Error) {
          console.error('Error fetching appraisal notification:', expiryResponse);
        } else {
          setAppraisalNotification(expiryResponse.data?.data?.message);
          currentNotifications.employeeNotifications.appraisalNotification = expiryResponse.data?.data?.message;
        }
  
        if (notiStartsResponse instanceof Error) {
          console.error('Error fetching notification start:', notiStartsResponse);
        } else {
          setNotiStartsNotification(notiStartsResponse.data?.message);
          currentNotifications.employeeNotifications.notiStartsNotification = notiStartsResponse.data?.message;
        }
  
        if (submitResponse instanceof Error) {
          console.error('Error fetching submit notification:', submitResponse);
        } else {
          setSubmitNotification(submitResponse.data?.message);
          currentNotifications.employeeNotifications.submitNotification = submitResponse.data?.message;
        }
  
        if (notifyGoalsResponse instanceof Error) {
          console.error('Error fetching goal notification:', notifyGoalsResponse);
        } else {
          setGoalNotification(notifyGoalsResponse.data?.notificationMessage);
          currentNotifications.employeeNotifications.goalNotification = notifyGoalsResponse.data?.notificationMessage;
        }
  
        console.log("Employee Notifications:", currentNotifications.employeeNotifications);
  
      } catch (error) {
        console.error("Error fetching employee notifications:", error);
      }
    }
  
    const hasNew = compareNotifications(currentNotifications, seenNotifications);
    setHasNewNotifications(hasNew);
  
    if (showNotificationDropdown) {
      updateSeenNotifications(currentNotifications);
    }
  
  } catch (error) {
    console.error('Error fetching notifications:', error);
    setError(error.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
  }  
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showNotificationDropdown) {
      const currentNotifications = {
        appraisalNotification,
        submitNotification,
        notiStartsNotification,
        managerNotification
      };
      updateSeenNotifications(currentNotifications);
    }
  }, [appraisalNotification, managerNotification, notiStartsNotification, submitNotification, showNotificationDropdown]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowNotificationDropdown((prev) => !prev);
    if (!showNotificationDropdown) {
      setHasNewNotifications(false);
    }
  };
  const empInitial = employeeName.charAt(0).toUpperCase();

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-2.5 flex justify-between items-center h-[50px]">
      <div className="logo">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </div>
      {empType === 'Employee' && (
        <div className="fixed ml-36 left-0 flex space-x-8">
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'dashboard' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('dashboard', '/employee-dashboard')}
          >
            Dashboard
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'performance' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('performance', '/employee-performance')}
          >
            Performance
          </div>
        </div>
      )}
      
      {empType === 'Manager' && (
        <div className="fixed ml-36 left-0 flex space-x-8">
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'dashboard' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('dashboard', '/manager-dashboard')}
          >
            Dashboard
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'myPerformance' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('myPerformance', '/manager-my-performance')}
          >
            My Performance
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'performance' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('performance', '/manager-performance')}
          >
            Performance
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'goals' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('goals', '/manager-Goals')}
          >
            Employee Goals
          </div>
        </div>
      )}
      
      {empType === 'HR' && (
        <div className="fixed ml-36 left-0 flex space-x-8">
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'dashboard' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('dashboard', '/hr-dashboard')}
          >
            Dashboard
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'myPerformance' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('myPerformance', '/hr-myperformance')}
          >
            My Performance
          </div>
          <div
            className={`nav-item cursor-pointer relative ${activeTab === 'performance' ? 'text-blue-600 after:content-[""] after:absolute after:left-0 after:bottom-[-13px] after:w-full after:h-[2px] after:bg-blue-600' : 'text-gray-600'}`}
            onClick={() => handleTabClick('performance', '/hr-performance')}
          >
            Performance
          </div>
        </div>
      )}

      <div className="header-right flex items-center ml-5">
        <div className="relative mr-4" ref={notificationRef}>
          <button
            className="text-lg flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 relative"
            onClick={toggleDropdown}
          >
            <div className="h-8 w-10 rounded-full bg-transparent hover:bg-[#E9F2FF] transition duration-300 ease-in-out flex items-center justify-center">
              <svg
                width="22"
                height="20"
                viewBox="0 0 24 24"
                className="h-6 w-auto transition-colors duration-300 ease-in-out"
                xmlns="http://www.w3.org/2000/svg"
                fill={isHovered ? "#0C66E4" : "#44546F"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <path d="M6.49 17.67a2 2 0 0 0 2.83 0l-2.83-2.83a2 2 0 0 0 0 2.83m4.89-12.19-.72.73c-.78.78-2.21 1.81-3.21 2.31l-3.02 1.51c-.49.25-.58.77-.19 1.17l8.56 8.56c.4.4.92.31 1.17-.19l1.51-3.02c.49-.99 1.53-2.42 2.31-3.21l.73-.73a5.05 5.05 0 0 0 .64-6.36 1.01 1.01 0 1 0-1.35-1.49q-.04.04-.07.08A5.04 5.04 0 0 0 14.95 4a5.04 5.04 0 0 0-3.57 1.48" />
              </svg>
            </div>
            {hasNewNotifications && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotificationDropdown && (
            <div className="w-80 bg-white p-4 absolute top-full right-0 shadow-xl border border-gray-200 mt-3 rounded-md overflow-y-auto">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Notifications</h2>
              <hr className="border-b-2 border-gray-200" /><br/>

              {isLoading && (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              )}

              {error && (
                <div>
                  <div className="bg-red-50 p-4 rounded-md mb-4 border-l-4 border-red-400">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <img src={nothing} alt="Nothing to show" className="h-32 w-auto" />
                  </div>
                </div>
              )}

              {empType === 'Employee' && (
                !isLoading && !error ? (
                  <>
                    {appraisalNotification && (
                      <div className="bg-yellow-50 p-4 rounded-md mb-4 border-l-4 border-yellow-500 text-amber-950 font-normal">
                        <p className="text-md">{appraisalNotification}</p>
                      </div>
                    )}
                    
                    {submitNotification && (
                      <div className="bg-green-50 p-4 rounded-md mb-4 border-l-4 border-green-500 text-green-950 font-normal">
                        <p className="text-md">{submitNotification}</p>
                      </div>
                    )}

                    {notiStartsNotification && (
                      <div className="bg-blue-50 p-4 rounded-md mb-4 border-l-4 border-blue-500 text-blue-950 font-normal">
                        <p className="text-md">{notiStartsNotification}</p>
                      </div>
                    )}
                    
                     {GoalNotification && (
                      <div className="bg-blue-50 p-4 rounded-md mb-4 border-l-4 border-blue-500 text-blue-950 font-normal">
                        <p className="text-md">{GoalNotification}</p>
                      </div>
                    )}

                    {!appraisalNotification && !submitNotification && !notiStartsNotification && !GoalNotification && (
                      <div className="text-center">
                        <p className="text-gray-600 mb-6">No notifications to display</p>
                        <div className="flex items-center justify-center h-full">
                          <img src={nothing} alt="Nothing to show" className="h-32 w-auto" />
                        </div>
                      </div>
                    )}
                  </>
                ) : null
              )}

              {empType === 'Manager' && (
                !isLoading && !error ? (
                  <>
                    {managerNotification && managerNotification.length > 0 ? (
                      managerNotification.map((message, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-md mb-4 border-l-4 border-green-500 text-green-950 font-normal">
                          <p className="text-md">{message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center">
          <p className="text-gray-600 mb-6">No notifications to display</p>
          <div className="flex items-center justify-center h-full">
            <img src={nothing} alt="Nothing to show" className="h-32 w-auto" />
          </div>
        </div>
      )}
    </>
  ) : (
    <p>Loading notifications...</p>
  )
)}


          </div>
        )}
      </div>
   
          
        <div className="relative" ref={userRef}>
          <button
            className="text-lg flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-400"
            onClick={() => setShowUserDropdown(prev => !prev)}
          >
            {empInitial}
          </button>
          {showUserDropdown && (
            <div className="absolute top-full right-0 rounded-md bg-white border border-gray-300 shadow-md z-10 w-[250px] mt-4">
              <div className='flex p-3'>
                <div className="w-8 mr-4 space-y-2  h-8 rounded-full bg-gray-300  relative flex items-center justify-center">
                  <button className="text-lg flex items-center justify-center w-8 h-8 bg-blue-500 text-white font-medium rounded-full">
                    {empInitial}
                  </button>
                </div>
                <div>
                  <label className='mt-2'>{employeeName}</label>
                  <p className='text-sm'>{designation}</p>
                </div>
              </div>
              <hr />
              <ul className="list-none p-0 m-0">
                <li className="p-4 text-base flex items-center cursor-pointer hover:bg-gray-200" onClick={handleMyProfie}>
                  <i className="fas fa-user mr-3.5"></i> My Profile
                </li>
                <li className="p-2 m-1 mb-2 text-base text-center cursor-pointer hover:bg-blue-500 text-white bg-blue-400 rounded-md mt-2">
                  <button className='border-1 text-center rounded-sm' onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;