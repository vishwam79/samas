import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import RotatingTrianglesComp from "../Global/utils/RotatingTriangles";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import {
  faB,
  faBuilding,
  faChild,
  faEnvelope,
  faIdBadge,
  faLocationArrow,
  faPhone,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  // PopoverFooter,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  // PopoverAnchor,
} from "@chakra-ui/react";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";

export default function HandleTaskAllocation() {
  const location = useLocation();
  const { personData } = location.state;
  let data = personData;

  const {
    openSidebar,
    setOpenSidebar, // for opeining and closing sidebar in big devices
    
    profileData,
    allocateNewTask,
    viewAllocatedTaskVivaDate,
    handleFieldValueUpdateOfTheAllocatedTask,
    handleDeletionOfAllocatedTask,
  } = useContext(createSomeContext);

  const [openTable, setOpenTable] = useState(false);

  const handleTab = () => {
    setOpenTable(!openTable);
  };

  const [newTask, setNewTask] = useState({
    taskName: "",
    taskDesc: "",
    startDate: "",
    endDate: "",
  });

  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(3, "month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [tableData, setTableDate] = useState();
  const [duplicateTableData, setDuplicateTableData] = useState();
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);

  // //! handle task allocation form field change
  const handleOnChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // //! handle cancel button click
  const handleCancel = () => {
    setNewTask({
      taskName: "",
      taskDesc: "",
      startDate: "",
      endDate: "",
    });
  };

  // //! handle task allocation form submit
  const AllocateNewTask = async (e) => {
    e.preventDefault();
    const res = await allocateNewTask(
      data._id,
      profileData._id,
      newTask.taskName,
      newTask.taskDesc,
      newTask.startDate,
      newTask.endDate
    );
    const json = await res.json();
    if (json.success === true) {
      toast.success("Task allocated successfully.");
    } else {
      toast.error("Error...");
    }
  };

  // //! fetch allocated data
  const fetchAllocatedData = async () => {
    // e.preventDefault();
    if (startDate > endDate) {
      toast.error("Start Date must be lesser than or eqqual to end date.");
      return;
    }
    setLoading(true);
    // here data._id is the db id of the person to whom we are allotting the task
    const res = await viewAllocatedTaskVivaDate(data._id, startDate, endDate);
    const json = await res.json();
    if (json.success === true) {
      setTableDate(json.data);
      setDuplicateTableData(json.data);
      setTotal(json.data.length);
      console.log(json.data);
    } else {
      toast.error("Error in loading...");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (data) {
      fetchAllocatedData();
    }
    // eslint-disable-next-line
  }, [data]);

  // //! display table data
  const displayTable = () => {
    return (
      tableData &&
      tableData.map((d, ind) => {
        return (
          <tr key={ind}>
            <td>{ind + 1}</td>
            <td>{d.taskName}</td>
            <td>
              {d.allocatedBy["_id"] === profileData._id ? (
                <Popover>
                  <PopoverTrigger>
                    <Button>Show</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Description</PopoverHeader>
                    <PopoverBody>
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        value={d.taskDesc}
                        className="focus:outline-none"
                        onChange={(e) =>
                          handleFieldValueUpdate(
                            "taskDesc",
                            e.target.value,
                            d._id,
                            profileData._id
                          )
                        }
                      ></textarea>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <Button>Show</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Description</PopoverHeader>
                    <PopoverBody>{d.taskDesc}</PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </td>
            <td>
              {d.allocatedBy["_id"] === profileData._id ? (
                <Popover>
                  <PopoverTrigger>
                    <Button>Show</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Remarks</PopoverHeader>
                    <PopoverBody>
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        value={d.remarks}
                        className="focus:outline-none"
                        onChange={(e) =>
                          handleFieldValueUpdate(
                            "remarks",
                            e.target.value,
                            d._id,
                            profileData._id
                          )
                        }
                      ></textarea>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <Button>Show</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Remarks</PopoverHeader>
                    <PopoverBody>{d.remarks}</PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </td>
            <td>{moment(d.startDate).format("YYYY-MM-DD")}</td>
            <td>{moment(d.deadline).format("YYYY-MM-DD")}</td>
            <td>{d.allocatedBy && d.allocatedBy["role"]}</td>
            <td>{d.status}</td>
            <td>
              <button
                type="button"
                onClick={(e) =>
                  handleTaskDelete(ind, d._id, d.allocatedBy["_id"])
                }
              >
                <FontAwesomeIcon icon={faTrash} color="red" />
              </button>
            </td>
          </tr>
        );
      })
    );
  };

  // //! handle search in table
  const [text, setText] = useState();
  const handleSearch = () => {
    if (!text.length) {
      return;
    }
    const filteredData =
      duplicateTableData &&
      duplicateTableData.filter(
        (item) =>
          (item.startDate &&
            item.startDate
              .toString()
              .toLowerCase()
              .includes(text.toLowerCase())) ||
          (item.deadline &&
            item.deadline
              .toString()
              .toLowerCase()
              .includes(text.toLowerCase())) ||
          (item.taskName &&
            item.taskName.toLowerCase().includes(text.toLowerCase())) ||
          (item.taskDesc &&
            item.taskDesc.toLowerCase().includes(text.toLowerCase())) ||
          (item.remarks &&
            item.remarks.toLowerCase().includes(text.toLowerCase())) ||
          (item.status &&
            item.status.toLowerCase().includes(text.toLowerCase())) ||
          (item.allocatedBy &&
            item.allocatedBy.role.toLowerCase().includes(text.toLowerCase()))
      );
    // console.log("filteredData", filteredData);
    setTableDate(filteredData);
  };
  React.useEffect(() => {
    if (!text) {
      setTableDate(duplicateTableData);
    }
  }, [text, duplicateTableData]);

  // //! update field value
  const handleFieldValueUpdate = async (
    fieldName,
    value,
    taskDBId,
    allocatedByDBId
  ) => {
    // update in our local component
    if (tableData.length === total) {
      let update = [...tableData];
      for (let i = 0; i < update.length; i++) {
        if (update[i]._id === taskDBId) {
          if (fieldName === "taskDesc") {
            update[i].taskDesc = value;
          } else if (fieldName === "remarks") {
            update[i].remarks = value;
          }
          break;
        }
      }
      setTableDate(update);
      setDuplicateTableData(update);
    }
    // now, make a request to server
    const res = await handleFieldValueUpdateOfTheAllocatedTask(
      fieldName,
      profileData.role + " :-- " + value,
      taskDBId,
      allocatedByDBId
    );
    const json = await res.json();

    if (json.success === true) {
      if (tableData.length !== total) {
        window.location.reload();
      }
    } else {
      toast.error("Try again.");
      window.location.reload();
    }
  };

  // //! handle task delete
  const handleTaskDelete = async (ind, taskDBId, allocatedByDBId) => {
    console.log(taskDBId);
    console.log(allocatedByDBId);
    if (allocatedByDBId !== profileData._id) {
      toast.info("You are not allocated this task...");
      return;
    }
    // all fine, make a request to server
    const res = await handleDeletionOfAllocatedTask(taskDBId, allocatedByDBId);
    const json = await res.json();

    if (json.success === true) {
      toast.success(json.message);
      if (total === tableData.length && total === duplicateTableData.length) {
        const update = [...tableData];
        update.splice(ind, 1);
        setTableDate(update);
        setDuplicateTableData(update);
      } else {
        window.location.reload();
      }
    } else {
      toast.error("Error...");
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
          <div className="task-container">
            <div className="person-information">
              <div className="person-information-heading">
                Person's Information
              </div>
              <div className="person-information-main-content">
                <div>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faIdBadge} />
                    </i>
                    <span>Employee ID</span> {data && data.employeeID}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faUser} />
                    </i>
                    <span>Name</span> {data && data.name}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </i>
                    <span>Email</span> {data && data.email}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faPhone} />
                    </i>
                    <span>Mobile</span> {data && data.mobile}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faB} />
                    </i>
                    <span>Whatsapp No</span> {data && data.whatsappNo}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faBuilding} />
                    </i>
                    <span>Department</span> {data && data.department}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faChild} />
                    </i>
                    <span>Age Group</span> {data && data.ageGroup}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faBuilding} />
                    </i>
                    <span>Role</span> {data && data.role}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faLocationArrow} />
                    </i>
                    <span>Address</span> {data && data.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="task-container-header">
              <div className={!openTable ? "activeTab" : ""}>
                <button type="button" onClick={() => handleTab()}>
                  Allocate New Task
                </button>
              </div>
              <div className={openTable ? "activeTab" : ""}>
                <button type="button" onClick={() => handleTab()}>
                  Display All Allocated Task
                </button>
              </div>
            </div>
            {!openTable ? (
              <>
                <div className="task-allocation-form">
                  <div className="form-container task-allocation-form-container">
                    <form onSubmit={AllocateNewTask}>
                      <div className="form-heading">
                        <p>Allocate New Task</p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="taskName">Task Name</label>
                        <input
                          type="text"
                          id="taskName"
                          name="taskName"
                          value={newTask.taskName}
                          placeholder="Enter name of the task"
                          onChange={handleOnChange}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="taskDesc">Task Description</label>
                        <textarea
                          id="taskDesc"
                          name="taskDesc"
                          value={newTask.taskDesc}
                          cols="30"
                          rows="10"
                          placeholder="Enter Description of the task"
                          onChange={handleOnChange}
                          required
                        ></textarea>
                      </div>
                      <div className="form-field">
                        <label htmlFor="startDate">
                          Starting Date of the task
                        </label>
                        <input
                          type="Date"
                          id="startDate"
                          name="startDate"
                          value={newTask.startDate}
                          onChange={handleOnChange}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="endDate">Ending Date of the task</label>
                        <input
                          type="Date"
                          id="endDate"
                          name="endDate"
                          value={newTask.endDate}
                          onChange={handleOnChange}
                          required
                        />
                      </div>
                      <div className="form-buttons">
                        <button type="button" onClick={() => handleCancel()}>
                          Cancel
                        </button>
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="search-bar-first-form all-allocated-task-search-form">
                  <form onSubmit={fetchAllocatedData}>
                    <div>
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        id="startDate"
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Select Start Date"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        id="endDate"
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="Select End Date"
                        required
                      />
                    </div>

                    <div>
                      <button type="submit" disabled>
                        Display Data
                      </button>
                    </div>
                  </form>
                </div>

                {loading ? (
                  <>
                    <RotatingTrianglesComp />
                  </>
                ) : (
                  <>
                    <div className="task-allocation-table">
                      <div className="table">
                        <div className="table_header">
                          <p>Allocated Task</p>
                          <div>
                            <input
                              type="text"
                              placeholder="Enter any text"
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                            />
                            <button type="button" onClick={handleSearch}>
                              Search
                            </button>
                          </div>
                        </div>
                        <div className="table_section">
                          <table>
                            <thead>
                              <tr>
                                <th>S. No.</th>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Remarks</th>
                                <th>Start Date</th>
                                <th>Deadline</th>
                                <th>Allocated By</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>{displayTable()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="task-container-footer">
              <button type="button" onClick={() => window.history.back()}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
