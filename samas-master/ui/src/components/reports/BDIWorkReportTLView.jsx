import React from "react";
import { useState, useEffect, useContext } from "react";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import RotatingTrianglesComp from "../Global/utils/RotatingTriangles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
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
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";

export default function BDIWorkReportTLView() {
  const {
    openSidebar, setOpenSidebar, // for opeining and closing sidebar in big devices

    profileData,
    viewOthersTasksVivaDateAndPageInfo,
    updateStatusOfTheTask,
    updateTaskFields,
    // deleteTaskByDBId
  } = useContext(createSomeContext);

  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "months").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [data, setData] = useState([]);
  const [copyOfOriginalData, setCopyofOriginalData] = React.useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(); // no of data in database
  const [resultCount, setResultCount] = useState(); // no of data coming from server from any request
  const [lastPageNo, setLastPageNo] = useState(1);

  const handleDisplayData = async (e) => {
    // e.preventDefault();
    // console.log(startDate);
    // console.log(endDate);
    if (startDate > endDate) {
      toast.error("Start Date must be lesser than or eqqual to end date.");
      return;
    }
    setLoading(true);
    const res = await viewOthersTasksVivaDateAndPageInfo(
      "BDI",
      profileData._id,
      startDate,
      endDate,
      pageNo,
      pageSize
    );
    const json = await res.json();
    console.log(json);
    if (json.success === true) {
      setData(json.data);
      setCopyofOriginalData(json.data);
      setTotal(json.data.length);
      setTotalCount(json.totalCount);
      setResultCount(json.resultCount);
      setLastPageNo(Math.ceil(json.totalCount / pageSize));
    } else {
      toast.error(json.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (profileData) {
      handleDisplayData();
    }
  }, [profileData, pageNo, pageSize]);

  // //! pagination button function
  const paginationButtonFunction = async (buttonType) => {
    if (buttonType === "prev") {
      if (pageNo === 1) return;
      setPageNo(pageNo - 1);
    } else if (buttonType === "next") {
      if (pageNo === lastPageNo) return;
      setPageNo(pageNo + 1);
    }
    // data automatically fetch by useEffect
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   const res = await viewOthersTasks("BDI", profileData._id);
  //   const json = await res.json();
  //   console.log(json);
  //   if (json.success === true) {
  //     setData(json.data);
  //     setCopyofOriginalData(json.data);
  //     setTotal(json.data.length);
  //   }
  //   else {
  //     toast.error(json.message);
  //   }
  //   setLoading(false);
  // }
  // useEffect(() => {
  //   if (profileData) {
  //     fetchData();
  //   }
  // }, [profileData]);

  // //! handle status update
  const handleStatusUpdate = async (statusValue, id) => {
    const res = await updateStatusOfTheTask(statusValue, id);
    const json = await res.json();
    console.log(json);
    if (json.success === true) {
      toast.success(json.message);
      if (data.length !== total) {
        window.location.reload();
      } else {
        let update = [...data];
        for (let i = 0; i < update.length; i++) {
          if (update[i]._id === id) {
            update[i].status = statusValue;
            break;
          }
        }
        setData(update);
        setCopyofOriginalData(update);
      }
    } else {
      toast.error("Error...");
    }
  };

  // //! update task remark
  const handleTaskRemark = async (remarkValue, id) => {
    if (data.length === total) {
      let update = [...data];
      for (let i = 0; i < update.length; i++) {
        if (update[i]._id === id) {
          update[i].remarks = remarkValue;
          break;
        }
      }
      setData(update);
      setCopyofOriginalData(update);
    }
    const res = await updateTaskFields("remarks", remarkValue, id);
    const json = await res.json();
    console.log(json);
    if (json.success === true) {
      // toast.success(json.message);
      if (data.length !== total) {
        window.location.reload();
      }
    } else {
      toast.error("Error...");
    }
  };

  // //! print table
  const printTable = () => {
    return (
      data &&
      data.map((d, ind) => {
        let date;
        if (d.date) {
          date = moment(d.date).format("YYYY-MM-DD");
        }
        return (
          <tr>
            <td>{ind + 1}</td>
            <td>{d.author.employeeID}</td>
            <td>{date}</td>
            <td>{d.author.name}</td>
            <td>{d.author.email}</td>
            <td>{d.taskName}</td>
            <td>{d.workHalf}</td>
            {/* <td>{d.description}</td> */}
            <td>
              {" "}
              <Popover>
                <PopoverTrigger>
                  <Button>Show</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Description</PopoverHeader>
                  <PopoverBody>{d.description}</PopoverBody>
                </PopoverContent>
              </Popover>
            </td>
            <td>
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
                      value={d.remarks}
                      cols="30"
                      rows="5"
                      className="focus:outline-none"
                      onChange={(e) => {
                        handleTaskRemark(e.target.value, d._id);
                      }}
                    ></textarea>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </td>
            <td>
              <select
                id="tls"
                name="creatorDBId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-2"
                value={d.status}
                onChange={(e) => handleStatusUpdate(e.target.value, d._id)}
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Not-Approved">Not-Approved</option>
                <option value="Created">Created</option>
              </select>
            </td>
            {/* <td>Day Status</td> */}
            {/* <td><button type='button' onClick={(e) => handleDelete(d._id, ind)}><FontAwesomeIcon icon={faTrash} color='red' /></button></td> */}
          </tr>
        );
      })
    );
  };

  // created by Satish Tiwari
  // //! handle search
  const [text, setText] = React.useState("");
  const handleSearch = () => {
    if (!text.length) {
      return;
    }
    const filteredData =
      copyOfOriginalData &&
      copyOfOriginalData.filter(
        (item) =>
          (item.date &&
            item.date.toString().toLowerCase().includes(text.toLowerCase())) ||
          (item.employeeID &&
            item.employeeID.toLowerCase().includes(text.toLowerCase())) ||
          (item.taskName &&
            item.taskName.toLowerCase().includes(text.toLowerCase())) ||
          (item.workHalf &&
            item.workHalf.toLowerCase().includes(text.toLowerCase())) ||
          (item.status &&
            item.status.toLowerCase().includes(text.toLowerCase())) ||
          (item.author &&
            item.author.name.toLowerCase().includes(text.toLowerCase())) ||
          (item.author &&
            item.author.email.toLowerCase().includes(text.toLowerCase()))
      );
    // console.log("filteredData", filteredData);
    setData(filteredData);
  };
  useEffect(() => {
    if (!text) {
      setData(copyOfOriginalData);
    }
  }, [text, copyOfOriginalData]);

  // //! handle delete
  // const handleDelete = async (id, ind) => {
  //   const res = await deleteTaskByDBId(id);
  //   const json = await res.json();
  //   if (json.success === true) {
  //     toast.success(json.message);
  //     if (total === data.length && total === copyOfOriginalData.length) {
  //       const update = [...data];
  //       update.splice(ind, 1);
  //       setData(update);
  //       setCopyofOriginalData(update);
  //     }
  //     else {
  //       window.location.reload();
  //     }
  //   }
  //   else {
  //     toast.error(json.message);
  //   }
  // }

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
          <div className="comp-container1">
            <div className="heading">Daily Work Report</div>
            {loading ? (
              <RotatingTrianglesComp />
            ) : (
              <>
                <div className="search-bar-first-form">
                  <form onSubmit={handleDisplayData}>
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
                      <button type="submit">Display Data</button>
                    </div>
                  </form>
                </div>

                <div className="table">
                  <div className="table_header">
                    <p>Task Report</p>
                    <p>BDI's Work Report</p>
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
                          <th>Employee ID</th>
                          <th>Date</th>
                          <th>Author Name</th>
                          <th>Author Mail</th>
                          <th>Task-Name</th>
                          <th>Work Half</th>
                          <th>Description</th>
                          <th>Remarks</th>
                          <th>Status</th>
                          {/* <th>Day Status</th> */}
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>{printTable()}</tbody>
                    </table>
                  </div>
                </div>

                 {/* pagination handling */}
                 <div className="pagination-section">
                  <div className="text-gray-600">
                    Showing {(pageNo - 1) * pageSize + 1} to{" "}
                    {(pageNo - 1) * pageSize + resultCount} of {totalCount}{" "}
                    Results
                  </div>

                  <div className="text-gray-600">
                    <span>
                      Page no : {pageNo} of {Math.ceil(lastPageNo)}
                    </span>{" "}
                    <span>Page Size : {pageSize}</span>
                  </div>

                  <div className="pagination-handle-section">
                    <button
                      type="button"
                      className="prev-button"
                      onClick={(e) => paginationButtonFunction("prev")}
                      disabled={pageNo === 1}
                    >
                      Prev
                    </button>
                    <select
                      id=""
                      name="pageSize"
                      className="ml-1 mr-1 text-white bg-gray-400"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="250">250</option>
                    </select>
                    <button
                      type="button"
                      className="next-button"
                      onClick={(e) => paginationButtonFunction("next")}
                      disabled={pageNo >= lastPageNo}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
