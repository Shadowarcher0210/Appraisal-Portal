import React, { useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
  const [selection, setSelection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState({
    salutation: '',
    name: '',
    employeeID: '',
    email: '',
    gender: '',
    designation: '',
    department: '',
    managerName: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const existingEmployees = [
    { name: 'Renuka Kompelly' },
    { name: 'Bindu Pavani Veerla' },
    { name: 'RamaKrishna Shiva' },
    { name: 'Ravi Kiran' },
    { name: 'Sobha Rani Dumpa' },
    { name: 'Venkatesh Ganaparapu' },
    { name: 'Naveen Pandranki' },
    // Add more existing employees here
  ];

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeDetails({ ...employeeDetails, [name]: value });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Employee Details:', employeeDetails);
    onClose();
  };

  const handleProceed = () => {
    console.log('Selected Employee:', selectedEmployee);
    onClose();
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const filteredEmployees = existingEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Create Appraisal</h2>

        <div className="mb-4">
          <p>Would you like to:</p>
          <label className="block mt-2">
            <input
              type="radio"
              name="selection"
              value="addNew"
              checked={selection === 'addNew'}
              onChange={handleSelectionChange}
              className="mr-2"
            />
            Add a New Employee
          </label>
          <label className="block mt-2">
            <input
              type="radio"
              name="selection"
              value="selectExisting"
              checked={selection === 'selectExisting'}
              onChange={handleSelectionChange}
              className="mr-2"
            />
            Select an Existing Employee
          </label>
        </div>

        {/* Add New Employee Form */}
        {selection === 'addNew' && (
          <form className="border border-gray-300 p-4 rounded-md">
            <div className="flex flex-wrap -mx-2">
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Salutation</label>
                <select
                  name="salutation"
                  value={employeeDetails.salutation}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Salutation</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                <input
                  type="text"
                  name="name"
                  value={employeeDetails.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employeeID"
                  value={employeeDetails.employeeID}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={employeeDetails.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={employeeDetails.gender}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={employeeDetails.designation}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={employeeDetails.department}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  value={employeeDetails.managerName}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            >
              Submit
            </button>
          </form>
        )}

        {/* Select Existing Employee with Search */}
        {selection === 'selectExisting' && (
          <div className="border border-gray-300 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search for an Employee</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by employee name..."
              className="mt-1 p-2 border border-gray-300 rounded-md w-full mb-4"
            />
            <ul className="max-h-40 overflow-y-auto mb-4">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <li
                    key={index}
                    className={`py-2 px-3 hover:bg-gray-100 cursor-pointer rounded ${selectedEmployee === employee ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleSelectEmployee(employee)}
                  >
                    {employee.name}
                  </li>
                ))
              ) : (
                <li className="py-2 px-3 text-gray-500">No employees found</li>
              )}
            </ul>
            {selectedEmployee && (
              <button
                onClick={handleProceed}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
              >
                Proceed
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
