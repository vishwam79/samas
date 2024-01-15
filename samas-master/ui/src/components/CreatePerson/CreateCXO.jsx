import React, { useState, useContext } from "react";
import createSomeContext from "../../context/createSomeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function CreateCXO() {
  const {
    openSidebar, setOpenSidebar, // for opening and closing sidebar in big devices 
    createPerson } = useContext(createSomeContext);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    employeeID: "",
    mobile: "",
    whatsappNo: "",
    password: "",
    confirmPassword: "",
    department: "Sales",
    ageGroup: "18-24",
    role: "CXO", // default set
    address: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setCredentials({
      name: "",
      email: "",
      employeeID: "",
      mobile: "",
      whatsappNo: "",
      password: "",
      confirmPassword: "",
      department: "Sales",
      ageGroup: "18-24",
      role: "CXO", // default set
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createPerson(
      credentials.name,
      credentials.email,
      "CXO" + credentials.employeeID,
      credentials.mobile,
      credentials.whatsappNo,
      credentials.password,
      credentials.department,
      credentials.ageGroup,
      credentials.address,
      credentials.role
    );
    const json = await res.json();
    if (json.success === true) {
      toast.success("CEO Created successfully.");
    } else {
      toast.error(json.message);
    }
  };

  return (
    <>
     {/* Sidebar toggle button :- not for small devices :- min-width : 1024px  */}
     <div className="navbar-toggle-test-second">
     {openSidebar ? (
       <button
         type="button"
         onClick={(e) => {
           setOpenSidebar(!openSidebar);
         }}
       >
       <i>
         <FontAwesomeIcon icon={faTimes} />
       </i>
       </button>
     ) : (
       <button type="button" onClick={(e) => setOpenSidebar(!openSidebar)}>
       <i>
         <FontAwesomeIcon icon={faBars} />
       </i>
       </button>
     )}
   </div>

   {/* global-container */}
   <div className="global-container lg:flex">
     {/* side bar component */}
     {openSidebar && <ProvideSidebar />}

        <div className="page-comp w-full min-w-0 flex-auto lg:static lg:max-h-full lg:overflow-visible">
          <div className="container1">
            <div className="heading">
              <p>Form</p>
            </div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="form-heading">
                  <p>Enter CXO Information</p>
                </div>
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={credentials.name}
                    onChange={handleChange}
                    placeholder="Name of the CXO"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Email of the CXO"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="employeeID">Employee ID</label>
                  <input
                    type="number"
                    id="employeeID"
                    name="employeeID"
                    value={credentials.employeeID}
                    onChange={handleChange}
                    placeholder="Employee ID of the BDI"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="mobile">Mobile No</label>
                  <input
                    type="number"
                    id="mobile"
                    name="mobile"
                    value={credentials.mobile}
                    onChange={handleChange}
                    placeholder="Mobile No of the CXO"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="whatsappNo">Whatsapp No</label>
                  <input
                    type="number"
                    id="whatsappNo"
                    name="whatsappNo"
                    value={credentials.whatsappNo}
                    onChange={handleChange}
                    placeholder="Whatsapp No of the CXO"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password of the CXO Account"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="conPass">Confirm Password</label>
                  <input
                    type="password"
                    id="conPass"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <div className="form-field">
                  <label
                    htmlFor="department"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Department
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={credentials.department}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="Sales" selected>
                      Sales
                    </option>
                    <option value="Marketing">Marketing</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Price Handling">Price Handling</option>
                  </select>
                </div>
                <div className="form-field">
                  <label
                    htmlFor="ageGroup"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Age Group
                  </label>
                  <select
                    name="ageGroup"
                    id="ageGroup"
                    value={credentials.ageGroup}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="18-24" selected>
                      18-24
                    </option>
                    <option value="25-30">25-30</option>
                    <option value="31-40">31-40</option>
                    <option value="41-50">41-50</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={credentials.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="button" onClick={(e) => handleCancel()}>
                    Cancel
                  </button>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
