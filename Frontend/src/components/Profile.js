// import React, { useState, useEffect } from 'react';
// import axios from 'axios'

// const Profile = () => {

//   const [filteredApps, ] = useState([]);
//   const [openMenuIndex, setOpenMenuIndex] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const employeeName = localStorage.getItem('empName')

//   const handleEditPhoto = () => {
//     alert('Edit Profile Photo Cliked')
//   }
//   const handleMenuClick = (index) => {
//     setOpenMenuIndex(openMenuIndex === index ? null : index);
//   };
//   const userDetails = async () => {
//     const employeeId = localStorage.getItem('employeeId');
//     console.log("Retrieved employeeId:", employeeId);
//     if (employeeId) {
//         try {
//             const response = await axios.get(`http://localhost:3003/all/details/${employeeId}`);
//             setUserData(response.data);
//             console.log("userdata", response.data); 
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//         }
//     } else {
//         console.log('User ID not found in local storage.');
//     }
// };

// useEffect(() => {
//   console.log("useEffect called to fetch user details");

//   userDetails();
// }, []); 


//   return (
//     <div className='ml-28 mt-20 mr-6'>
     
//         <h1 className='font-black text-3xl font-serif text-teal-400'>{employeeName}</h1>
//       <hr className='my-4'></hr>
//       <br></br>
//       <br />

//       <div className='rounded-2xl  shadow-md '>

//         <div className='flex'>
//           <div className="w-36 ml-8 mr-4 space-y-2  h-36 rounded-full bg-gray-300  relative flex items-center justify-center">
//             {userData ? (
//               <img src={userData.user.profile} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               <span className="text-4xl text-gray-500">👤</span>
//             )}         
//           </div>
//           {userData ? (
// <div>
//           <div className="space-x-2  ml-2 ">
//             <h1 className='text-2xl text-wrap mt-2 text-orange-500 '>{employeeName}</h1>
//             <h1 className='text-xl text-wrap mt-2 text-blue-700'>{userData.user.email}</h1>
//             <h1 className='text-xl mt-2 text-blue-500'>{userData.user.gender}</h1>

//           </div>

//           <div className='w-60 ml-28'>
//             <h1 className='text-xl text-blue-500'>Designation/title</h1>

//             <h1>{userData.user.designation}</h1>
//           </div>
//           <div className='w-60 ml-28'>
//             <h1 className='mt-2 text-xl text-blue-500'>Employment type </h1>
//             <h1>Permanent (full time)</h1>
//             <h1 className='mt-2 text-xl text-blue-500'>Band</h1>
//             <h1>{userData.user.band}</h1>
//           </div>
//             </div>    ):(<div></div>)}

//         </div>
//         <br></br>
//         <hr></hr>
//         <br></br>
//         <div className='' >
//           <div className='border'>

//           </div>
//         </div>
//       </div>
//       <br></br>
//       <hr></hr>
//       <br></br>
//       <div className='rounded-2xl border-1 border-black shadow-md shadow-slate-400 '>
//         <div className='ml-8 py-5'>
//           <h1 className='text-xl font-bold '>Employment Details</h1>
//           <text className='space-y-10 text-blue-300'>View or edit current employment details such as date of joining, designation, department, location, job description and more.</text>
//           <br></br>

//           <div className='mt-5'>
//             <label className='text-blue-400'>Date of joining</label>
//             <label className='ml-4'>xx/xx/xxxx</label>
//             <br></br>
//             <label className='mt-2 text-blue-400'>Designation/title</label>
//             <label className='ml-2'>
//               Team Member
//             </label>
//             <br></br>
//             <label className='text-blue-400 mt-2'>Department</label>
//             <label className=' ml-2'>Information Tech</label>
//             <br></br>
//             <label className='mt-2 text-blue-400'>Location</label>
//             <label className='ml-2'>Hyderabad</label>
//             <br></br>
//           </div>
//         </div>
//       </div>  
//     </div>

//   )
// }

// export default Profile
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [appraisalData, setAppraisalData] = useState(null);

  const employeeName = localStorage.getItem('empName');

  const userDetails = async () => {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      try {
        const response = await axios.get(`http://localhost:3003/all/details/${employeeId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else {
      console.log('User ID not found in local storage.');
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  const fetchAppraisalDetails = async () => {
    const employeeId = localStorage.getItem('employeeId');
    console.log("Retrieved employeeId:", employeeId);
    if (employeeId) {
        try {
            const response = await axios.get(`http://localhost:3003/form/display/${employeeId}`);
            setAppraisalData(response.data);
            console.log("userdata", response.data); 
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    } else {
        console.log('User ID not found in local storage.');
    }
};

  useEffect(() => {
    console.log("useEffect called to fetch user details");

    fetchAppraisalDetails();
  }, []); 


  return (
    <div className='flex flex-col flex-grow ml-24 mt-12 p-8 bg-gray-100'>
      <div className='bg-white p-8 mt-4 mb-28 rounded-lg shadow-lg'>
        <div className='flex items-center'>
          <div className='w-36 h-36 rounded-full overflow-hidden bg-gray-200'>
            {userData ? (
              <img src={userData.user.profile} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-gray-500 flex justify-center items-center h-full">👤</span>
            )}
          </div>
          <div className='ml-8'>
            <h1 className='text-3xl font-bold text-gray-800'>{employeeName}</h1>
            {userData && (
              <div className='mt-2'>
                <h2 className='text-lg text-blue-600'>{userData.user.email}</h2>
                <p className='text-lg text-gray-500'>{userData.user.gender}</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Details Section */}
        {userData && (
          <div className='mt-8'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Employee Details</h2>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <h3 className='text-gray-600 font-medium'>Designation</h3>
                <p className='text-lg text-gray-800'>{userData.user.designation}</p>
              </div>
              <div>
                <h3 className='text-gray-600 font-medium'>Employment Type</h3>
                <p className='text-lg text-gray-800'>Permanent (Full-Time)</p>
              </div>
              <div>
                <h3 className='text-gray-600 font-medium'>Band</h3>
                <p className='text-lg text-gray-800'>{userData.user.band}</p>
              </div>
              <div>
                <h3 className='text-gray-600 font-medium'>Date of Joining</h3>
                <p className='text-lg text-gray-800'>
                  {appraisalData ? appraisalData.initiatedOn : 'Loading...'}
                </p>
              </div>

              <div>
                <h3 className='text-gray-600 font-medium'>Department</h3>
                <p className='text-lg text-gray-800'>{userData.user.department}</p>
              </div>
              <div>
                <h3 className='text-gray-600 font-medium'>Location</h3>
                <p className='text-lg text-gray-800'>Hyderabad</p>
              </div>
            </div>
          </div>)}
          </div>
    </div>
  )}


export default Profile;
