import React from "react";
import { useState, useEffect, useContext } from "react";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import RotatingTrianglesComp from "../Global/utils/RotatingTriangles";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
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

export default function BDIReport() {
  const {
    openSidebar,
    setOpenSidebar, // for opening and closing sidebar in big devices
    fetchAllTaskCreatedByYouVivaDateAndPageInfo,
    deleteTaskByDBId,
  } = useContext(createSomeContext);

  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "months").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "months").format("YYYY-MM-DD")
  );

  const [data, setData] = useState([]);
  const [copyOfOriginalData, setCopyofOriginalData] = React.useState([]);
  const [total, setTotal] = useState(0); // no. of data come from server
  const [loading, setLoading] = useState(true);

  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(); // no of data in database
  const [resultCount, setResultCount] = useState(); // no of data coming from server from any request
  const [lastPageNo, setLastPageNo] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    // console.log("Token: ", sessionStorage.getItem("token"));
    const res = await fetchAllTaskCreatedByYouVivaDateAndPageInfo(
      startDate,
      endDate,
      pageSize,
      pageNo
    );
    const json = await res.json();
    // console.log(json);
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
    fetchData();
    // eslint-disable-next-line
  }, [pageNo, pageSize]);

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
            <td>{date}</td>
            <td>{d.taskName}</td>
            <td>{d.workHalf}</td>
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
              {" "}
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
            </td>
            <td>{d.status}</td>
            {/* <td>Day Status</td> */}
            <td>
              <button type="button" onClick={(e) => handleDelete(d._id, ind)}>
                <FontAwesomeIcon icon={faTrash} color="red" />
              </button>
            </td>
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
          (item.taskName &&
            item.taskName.toLowerCase().includes(text.toLowerCase())) ||
          (item.workHalf &&
            item.workHalf.toLowerCase().includes(text.toLowerCase())) ||
          (item.status &&
            item.status.toLowerCase().includes(text.toLowerCase()))
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
  const handleDelete = async (id, ind) => {
    const res = await deleteTaskByDBId(id);
    const json = await res.json();
    if (json.success === true) {
      toast.success(json.message);
      if (total === data.length && total === copyOfOriginalData.length) {
        const update = [...data];
        update.splice(ind, 1);
        setData(update);
        setCopyofOriginalData(update);
      } else {
        window.location.reload();
      }
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
          <div className="comp-container1">
            <div className="heading">Daily Work Report</div>
            {loading ? (
              <RotatingTrianglesComp />
            ) : (
              <>
                <div className="search-bar-first-form">
                  <form onSubmit={fetchData}>
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
                          <th>Date</th>
                          <th>Task-Name</th>
                          <th>Work Half</th>
                          <th>Description</th>
                          <th>Remarks</th>
                          <th>Status</th>
                          {/* <th>Day Status</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{printTable()}</tbody>
                    </table>
                  </div>
                </div>

                {/* pagination handling */}
                <div 
                className="pagination-section">
                  <div className="text-gray-600">
                    Showing {(pageNo - 1) * pageSize + 1} to {(pageNo - 1) * pageSize + resultCount} {" "}
                    of {totalCount} Results
                  </div>

                  <div className="text-gray-600">
                    <span>Page no : {pageNo} of {Math.ceil(lastPageNo)}</span>
                    {" "}
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
