// import { faTrash } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from "react";
import { RotatingTriangles } from "react-loader-spinner";
import { useContext } from "react";
import { Link } from "react-router-dom";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

export default function ShowAllBDITLView() {
  const [data, setData] = React.useState([]);
  const [copyOfOriginalData, setCopyofOriginalData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const {
    openSidebar, setOpenSidebar, // for opeining and closing sidebar in big devices
    fetchPersonsByRoleAndCreatorDBId,
    profileData,
    // deletePersonById,
    changeStatusOfThePersonById,
  } = useContext(createSomeContext);

  const fetchAllData = async () => {
    setLoading(true);
    const res = await fetchPersonsByRoleAndCreatorDBId("BDI", profileData._id);
    const json = await res.json();
    if (json.success === true) {
      setData(json.data);
      setCopyofOriginalData(json.data);
      setTotal(json.data.length);
    } else {
      toast.error("Error in fetching the data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profileData) {
      fetchAllData();
    }
    // eslint-disable-next-line
  }, []);

  //    console.log(data);

  // //! render table
  const displayData = () => {
    return (
      data &&
      data.map((d, ind) => {
        return (
          <tr key={ind}>
            <td>{ind + 1}</td>
            <td>{d.employeeID}</td>
            <td>{d.name}</td>
            <td>{d.email}</td>
            <td>{d.mobile}</td>
            <td>{d.whatsappNo}</td>
            <td>{d.department}</td>
            <td>{d.ageGroup}</td>
            <td>{d.role}</td>
            <td>{d.address}</td>
            <td>
              <Link
                to={`/${profileData.role
                  .toLowerCase()
                  .trim()}/handleTaskAllocation`}
                state={{ personData: d }}
              >
                Open
              </Link>
            </td>
            {/* <td><button type='button' onClick={(e) => handleDelete(d._id, ind)}><FontAwesomeIcon icon={faTrash} color='red' /></button></td> */}

            <td>
              <button
                type="button"
                className={
                  d.status === "active"
                    ? "activeStatusButton"
                    : "blockedStatusButton"
                }
                onClick={(e) =>
                  handleBlockUnBlock(
                    ind,
                    d._id,
                    d.status === "active" ? "blocked" : "active"
                  )
                }
              >
                {d.status === "active" ? "Block" : "Unblock"}
              </button>
            </td>
          </tr>
        );
      })
    );
  };

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
          (item.name && item.name.toLowerCase().includes(text.toLowerCase())) ||
          (item.employeeID &&
            item.employeeID.toLowerCase().includes(text.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(text.toLowerCase())) ||
          (item.mobile &&
            item.mobile.toLowerCase().includes(text.toLowerCase())) ||
          (item.whatsappNo &&
            item.whatsappNo.toLowerCase().includes(text.toLowerCase())) ||
          (item.address &&
            item.address.toLowerCase().includes(text.toLowerCase()))
      );
    // console.log("filteredData",filteredData);
    setData(filteredData);
  };

  useEffect(() => {
    if (!text) {
      setData(copyOfOriginalData);
    }
  }, [text, copyOfOriginalData]);

  // //! handle delete
  // const handleDelete = async (id, ind) => {
  //     // handle delete
  //     const res = await deletePersonById(id);
  //     const json = await res.json();
  //     if (json.success === true) {
  //         toast.success("Deletion Successfully.");
  //         if (total === data.length && total === copyOfOriginalData.length) {
  //             let update = [...data];
  //             update.splice(ind, 1);
  //             setData(update);
  //             setCopyofOriginalData(update);
  //         }
  //         else {
  //             window.location.reload();
  //         }
  //     }
  //     else {
  //         toast.error("Try after sometime.");
  //     }
  // }

  // //! handle block/unblock the perosn
  const handleBlockUnBlock = async (ind, personId, status) => {
    const res = await changeStatusOfThePersonById(personId, status);
    const json = await res.json();
    if (json.success === true) {
      toast.success("Status updated successfully.");
      if (total === data.length && total === copyOfOriginalData.length) {
        let update = [...data];
        update[ind].status = status;
        setData(update);
        setCopyofOriginalData(update);
      } else {
        window.location.reload();
      }
    } else {
      toast.error("Try after sometime.");
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
            <div className="heading">ALL BDI's</div>
            {loading ? (
              <div className="react-loader-spinner">
                <RotatingTriangles
                  visible={true}
                  height="100"
                  width="100"
                  ariaLabel="rotating-triangels-loading"
                  wrapperStyle={{}}
                  wrapperClass="rotating-triangels-wrapper"
                />
              </div>
            ) : (
              <>
                <div className="table">
                  <div className="table_header">
                    <p>BDI's Details</p>
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile No</th>
                          <th>WhatsApp No</th>
                          <th>Department</th>
                          <th>Age Group</th>
                          <th>Role</th>
                          <th>Address</th>
                          <th>Allocate Task</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{displayData()}</tbody>
                    </table>
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
