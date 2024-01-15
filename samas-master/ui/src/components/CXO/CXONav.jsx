import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import CXOSidebar from "./CXOSidebar";

export default function CXONav() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(false);
  }, []);
  return (
    <>
      <div className="navbar">CXO Pannel</div>
      <div className="logo">
        <img
          src="https://res.cloudinary.com/dzgaixltu/image/upload/v1693552944/logo_cmliyg.webp"
          alt=""
          onClick={() => navigate("/cxo/home")}
        />
      </div>

      {open ? <CXOSidebar /> : ""}

      <div className="navbar-toggle-test">
        <button
          type="button"
          onClick={(e) => {
            setOpen(!open);
          }}
        >
          {open ? (
            <FontAwesomeIcon icon={faTimes} style={{ color: "white" }} />
          ) : (
            <FontAwesomeIcon icon={faBars} style={{ color: "white" }} />
          )}
        </button>
      </div>
    </>
  );
}
