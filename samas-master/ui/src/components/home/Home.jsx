import React, { useContext } from "react";
import Typed from "typed.js";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import createSomeContext from "../../context/createSomeContext";

export default function Home() {
  const typingRef = React.useRef(null);
  React.useEffect(() => {
    const option = {
      strings: ["Sales Management System"],
      loop: true,
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 500,
    };
    const typed = new Typed(typingRef.current, option);
    return () => {
      typed.destroy();
    };
  }, []);

  const {
    openSidebar, setOpenSidebar, // for opeining and closing sidebar in big devices
  } = useContext(createSomeContext);

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
          <span title="Toggle Sidebar">
            <FontAwesomeIcon icon={faTimes} />
          </span>
          </i>
          </button>
        ) : (
          <button type="button" onClick={(e) => setOpenSidebar(!openSidebar)}>
          <i>
          <span title="Toggle Sidebar">
            <FontAwesomeIcon icon={faBars} />
          </span>
          </i>
          </button>
        )}
      </div>

      {/* global-container */}
      <div className="global-container lg:flex">
        {/* side bar component */}
        {openSidebar && <ProvideSidebar />}

        <div className="page-comp w-full min-w-0 flex-auto lg:static lg:max-h-full lg:overflow-visible">
          <div className="container">
            <div className="heading">
              <p>Home</p>
            </div>
            <div className="home-image-section">
              <div>
                <img
                  src="https://res.cloudinary.com/dzgaixltu/image/upload/v1693552944/logo_cmliyg.webp"
                  alt=""
                />
              </div>
            </div>
            <div className="home-section-text">
              <p>
                <span ref={typingRef} className="typing-text"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
