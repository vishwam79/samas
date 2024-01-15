import React from "react";
import { useLocation } from "react-router-dom";
import BDISidebar from "../../BDI/BDISidebar";
import TLSidebar from "../../TL/TLSidebar";
import CXOSidebar from "../../CXO/CXOSidebar";
import MDSidebar from "../../MD/MDSidebar";
// react AOS module for animation
import AOS from "aos";
import "aos/dist/aos.css";

export default function ProvideSidebar() {
  React.useEffect(() => {
    AOS.init();
  }, []);

  const location = useLocation();

  if (location.pathname.startsWith("/bdi/")) {
    return (
      <div
        className="fixed inset-0 z-50  w-64 flex-none border-r border-gray-200 dark:border-gray-600 lg:static lg:block lg:h-auto lg:overflow-y-visible  hidden bg-white"
        // data-aos="fade-right"
        // data-aos-delay="100"
      >
        <BDISidebar />
      </div>
    );
  } else if (location.pathname.startsWith("/tl")) {
    return (
      <div
        className="fixed inset-0 z-50  w-64 flex-none border-r border-gray-200 dark:border-gray-600 lg:static lg:block lg:h-auto lg:overflow-y-visible  hidden bg-white"
        // data-aos="fade-right"
        // data-aos-delay="100"
      >
        <TLSidebar />
      </div>
    );
  } else if (location.pathname.startsWith("/cxo")) {
    return (
      <div
        className="fixed inset-0 z-50  w-64 flex-none border-r border-gray-200 dark:border-gray-600 lg:static lg:block lg:h-auto lg:overflow-y-visible  hidden bg-white"
        // data-aos="fade-right"
        // data-aos-delay="100"
      >
        <CXOSidebar />
      </div>
    );
  } else if (location.pathname.startsWith("/md")) {
    return (
      <div
        className="fixed inset-0 z-50  w-64 flex-none border-r border-gray-200 dark:border-gray-600 lg:static lg:block lg:h-auto lg:overflow-y-visible  hidden bg-white"
        // data-aos="fade-right"
        // data-aos-delay="100"
      >
        <MDSidebar />
      </div>
    );
  }

  // if none of the condition match then return null...
  return null;
}
