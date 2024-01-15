import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faSignOut,
  faHome,
  faUser,
  faFile,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import createSomeContext from "../../context/createSomeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BDISidebar() {
  const { profileData } = useContext(createSomeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // //!handle logout click
  const logout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logout Successfully.");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <> 
          <div className="sidebar border-r border-gray-200 dark:border-gray-600 w-64"
            style={{ marginLeft: "0rem", borderRadius: "0rem", maxHeight:'90vh', minHeight:'90vh'}}
          >
            <div className="overflow-y-auto px-4 lg:pt-0 h-full bg-white scrolling-touch max-w-2xs  lg:block lg:mr-0 lg:sticky  font-normal text-base lg:text-sm">
              <div className="first-div">
                {profileData ? (
                  <>
                    <img src={profileData.imgUrl} alt="" />
                  </>
                ) : (
                  ""
                )}
              </div>
              <ul>
                <li
                  className={
                    location.pathname === "/bdi/home" ? "li-active" : ""
                  }
                >
                  <Link to={"/bdi/home"}>
                    <FontAwesomeIcon icon={faHome} /> <span>Home</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/bdi/profile" ? "li-active" : ""
                  }
                >
                  <Link to={"/bdi/profile"}>
                    <FontAwesomeIcon icon={faUser} /> <span> Profile</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/bdi/taskForm" ? "li-active" : ""
                  }
                >
                  <Link to={"/bdi/taskForm"}>
                    <FontAwesomeIcon icon={faTasks} /> <span>Form</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/bdi/report" ? "li-active" : ""
                  }
                >
                  <Link to={"/bdi/report"}>
                    <FontAwesomeIcon icon={faFile} /> <span>Report</span>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/bdi/allAllocatedTaskToUs"
                      ? "li-active"
                      : ""
                  }
                >
                  <Link to={"/bdi/allAllocatedTaskToUs"}>
                    <FontAwesomeIcon icon={faFile} />{" "}
                    <span>Allocated Tasks</span>
                  </Link>
                </li>
              </ul>
              <div className="last-div">
                <button type="button" onClick={(e) => window.location.reload()}>
                  <FontAwesomeIcon icon={faRefresh} />
                  <span>Reload</span>
                </button>
                <button type="button" onClick={(e) => logout()}>
                  <FontAwesomeIcon icon={faSignOut} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
     </>
  );
}
