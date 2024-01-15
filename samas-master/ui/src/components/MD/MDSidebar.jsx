import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faSignOut,
  faHome,
  faUser,
  faFile,
  faUserPlus,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import createSomeContext from "../../context/createSomeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MDSidebar() {
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
      <div
        className="sidebar border-r border-gray-200 dark:border-gray-600 w-64"
        style={{ marginLeft: "0rem", borderRadius: "0rem", maxHeight: "90vh",minHeight:'90vh'}}
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
          <ul style={{ height: "20rem", overflow: "auto" }}>
            <li className={location.pathname === "/md/home" ? "li-active" : ""}>
              <Link to={"/md/home"}>
                <FontAwesomeIcon icon={faHome} /> <span>Home</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/md/profile" ? "li-active" : ""}
            >
              <Link to={"/md/profile"}>
                <FontAwesomeIcon icon={faUser} /> <span> Profile</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/md/bdi-work-report" ? "li-active" : ""
              }
            >
              <Link to={"/md/bdi-work-report"}>
                <FontAwesomeIcon icon={faFile} /> <span>BDI Report</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/md/tl-work-report" ? "li-active" : ""
              }
            >
              <Link to={"/md/tl-work-report"}>
                <FontAwesomeIcon icon={faFile} /> <span>TL Report</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/md/ceo-work-report" ? "li-active" : ""
              }
            >
              <Link to={"/md/ceo-work-report"}>
                <FontAwesomeIcon icon={faFile} /> <span>CXO Report</span>
              </Link>
            </li>

            <li
              className={
                location.pathname === "/md/create-ceo" ? "li-active" : ""
              }
            >
              <Link to={"/md/create-ceo"}>
                <FontAwesomeIcon icon={faUserPlus} /> <span>Create CXO</span>
              </Link>
            </li>

            <li
              className={location.pathname === "/md/allBDI" ? "li-active" : ""}
            >
              <Link to={"/md/allBDI"}>
                <FontAwesomeIcon icon={faUserGroup} /> <span>Show ALl BDI</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/md/allTL" ? "li-active" : ""}
            >
              <Link to={"/md/allTL"}>
                <FontAwesomeIcon icon={faUserGroup} /> <span>Show ALl TL</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/md/allCEO" ? "li-active" : ""}
            >
              <Link to={"/md/allCEO"}>
                <FontAwesomeIcon icon={faUserGroup} /> <span>Show ALl CXO</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/md/allMD" ? "li-active" : ""}
            >
              <Link to={"/md/allMD"}>
                <FontAwesomeIcon icon={faUserGroup} />{" "}
                <span>Show ALl Director</span>
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
