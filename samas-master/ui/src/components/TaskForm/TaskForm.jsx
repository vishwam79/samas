import React, { useState, useContext } from "react";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

export default function TaskForm() {
  const { openSidebar, setOpenSidebar, newTask } = useContext(createSomeContext);

  const [credentials, setCredentials] = useState({
    date: "",
    taskName: "",
    description: "",
    workHalf: "First Half",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setCredentials({
      date: "",
      taskName: "",
      description: "",
      workHalf: "First Half",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // date, taskName, description, workHalf
    const res = await newTask(
      credentials.date,
      credentials.taskName,
      credentials.description,
      credentials.workHalf
    );
    const json = await res.json();
    // console.log(json);
    if (json.success === true) {
      toast.success("Task Created Successfully.");
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
                  <p>Enter you task</p>
                </div>
                <div className="form-field">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={credentials.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="taskName">Task Name</label>
                  <input
                    type="text"
                    name="taskName"
                    value={credentials.taskName}
                    onChange={handleChange}
                    placeholder="Name of the task"
                    required
                  />
                </div>
                <div className="form-field">
                  <div className="text-area-heading">
                    <p>Description</p>
                  </div>
                  <textarea
                    name="description"
                    id="desc"
                    cols="15"
                    rows="5"
                    value={credentials.description}
                    onChange={handleChange}
                    placeholder="Description"
                  ></textarea>
                </div>
                <div className="form-field">
                  <label htmlFor="half">Work Half</label>
                  <div className="radio">
                    <input
                      type="radio"
                      id="half1"
                      name="workHalf"
                      value="First Half"
                      onChange={handleChange}
                      checked={credentials.workHalf === "First Half"}
                    />
                    <label htmlFor="half1">First Half</label>
                  </div>
                  <div className="radio">
                    <input
                      type="radio"
                      id="half2"
                      name="workHalf"
                      value="Second Half"
                      onChange={handleChange}
                      checked={credentials.workHalf === "Second Half"}
                    />
                    <label htmlFor="half2">Second Half</label>
                  </div>
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
    </>
  );
}
