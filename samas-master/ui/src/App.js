import React from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MoveToAppropriatePanel from "./components/Global/ProvideReqComp/MoveToAppropriatePanel"; // we employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
import Helmet from 'react-helmet';
import { useContext } from "react";
import createSomeContext from "./context/createSomeContext";

// //* ------------------------ Globally accessable pages -----------------------------------------
// //! Global
import Login from "./components/Global/auth/Login";
import UpdatePassword from "./components/Global/auth/UpdatePassword";

// //! Home
import Home from "./components/home/Home";

// //! Profile
import Profile from "./components/Profile/Profile";

// //! TaskForm
import TaskForm from "./components/TaskForm/TaskForm";

// //! Allocated Task
import AllAllocatedTaskToUs from "./components/AllocatedTask/AllAllocatedTaskToUs";

// //* ------------------------------ accessible pages with some hierarchy -------------------------------------

// //! Reports
import BDIWorkReport from "./components/reports/BDIWorkReport";
import BDIWorkReportTLView from "./components/reports/BDIWorkReportTLView";
import TLWorkReport from "./components/reports/TLWorkReport";
import TLWorkReportCXOView from "./components/reports/TLWorkReportCXOView";
import CXOWorkReport from "./components/reports/CXOWorkReport";

// //! Create Person 
import CreateBDI from "./components/CreatePerson/CreateBDI";
import CreateTL from "./components/CreatePerson/CreateTL";
import CreateCXO from "./components/CreatePerson/CreateCXO";

// //! Show Person
import ShowAllBDI from "./components/ShowPerson/ShowAllBDI";
import ShowAllTL from "./components/ShowPerson/ShowAllTL";
import ShowAllCXO from "./components/ShowPerson/ShowAllCXO";
import ShowAllMD from "./components/ShowPerson/ShowAllMD";
import ShowAllBDITLView from "./components/ShowPerson/ShowAllBDITLView";

// //! Handle Task Allocation
import HandleTaskAllocation from "./components/Task-Allocation/HandleTaskAllocation";

// //! Lead Generation 
import LeadGeneration from "./components/LMS/LeadGeneration";


// //* ------------------------ Separate Pages -------------------------------------------

// //! BDI
import BDINav from "./components/BDI/BDINav";
// import BDISidebar from "./components/BDI/BDISidebar";
import BDIReport from "./components/BDI/BDIReport";

// //! TL
import TLNav from "./components/TL/TLNav";
import TLReport from "./components/TL/TLReport";

// //! CXO
import CXONav from "./components/CXO/CXONav";
import CXOReport from "./components/CXO/CXOReport";

// //! MD
import MDNav from "./components/MD/MDNav";

// //* ----------------------------------- CSS Files --------------------------------------------

// //!CSS
import './assets/css/Style1.css';
import './assets/css/Style2.css';
import './assets/css/Style3.css';
import './assets/css/Style4.css';
import './assets/css/Style5.css';
import './assets/css/Style6.css';

// //* ----------------------------- Routing functions ---------------------------------------------

function Global() {
  return (
    <>
      <Routes>
        <Route exect path="/" element={<Login />} />
        <Route exect path="/updatePassword" element={<UpdatePassword />} />
      </Routes>
    </>
  )
}

function BDI() {
  const location = useLocation();
  const bdi = location.pathname.startsWith('/bdi/');

  const navigate = useNavigate()
  React.useEffect(() => {
    if (!sessionStorage.getItem("token") && bdi) {
      navigate("/");
    }
  })

  // Utilize the person's role information from profileData to protect routes from unauthorized access. 
  // In this context, we also employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
  const {
    profileData
  } = useContext(createSomeContext);
  return (
    <>
      {bdi && profileData && profileData.role === 'BDI' && <BDINav />}
      <MoveToAppropriatePanel/>
      <Routes>
        { profileData && profileData.role === 'BDI' && <Route exect path="/bdi/home" element={<Home />} /> }
        { profileData && profileData.role === 'BDI' && <Route exect path="/bdi/profile" element={<Profile />} /> }
        { profileData && profileData.role === 'BDI' && <Route exect path="/bdi/taskForm" element={<TaskForm />} /> }
        { profileData && profileData.role === 'BDI' && <Route exect path="/bdi/report" element={<BDIReport />} /> }
        { profileData && profileData.role === 'BDI' && <Route exect path="/bdi/allAllocatedTaskToUs" element={<AllAllocatedTaskToUs/>} /> }
      </Routes>
    </>
  )
}

function TL() {
  const location = useLocation();
  const tl = location.pathname.startsWith('/tl');

  const navigate = useNavigate()
  React.useEffect(() => {
    if (!sessionStorage.getItem("token") && tl) {
      navigate("/");
    }
  })

  // Utilize the person's role information from profileData to protect routes from unauthorized access. 
  // In this context, we also employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
  const {
    profileData
  } = useContext(createSomeContext);
  return (
    <>
      {tl && profileData && profileData.role === 'TL' && <TLNav />}
      <MoveToAppropriatePanel/>
      <Routes>
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/home" element={<Home />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/profile" element={<Profile />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/taskForm" element={<TaskForm />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/report" element={<TLReport />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/allAllocatedTaskToUs" element={<AllAllocatedTaskToUs/>} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/bdi-work-report" element={<BDIWorkReportTLView />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/create-bdi" element={<CreateBDI />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/allBDI" element={<ShowAllBDITLView />} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/handleTaskAllocation" element={<HandleTaskAllocation/>} /> }
       { profileData && profileData.role === 'TL' && <Route exect path="/tl/leadGeneration" element={<LeadGeneration/>} /> }
      </Routes>
    </>
  )
}

function CXO() {
  const location = useLocation();
  const cxo = location.pathname.startsWith("/cxo");

  const navigate = useNavigate()
  React.useEffect(() => {
    if (!sessionStorage.getItem("token") && cxo) {
      navigate("/");
    }
  })

  // Utilize the person's role information from profileData to protect routes from unauthorized access. 
  // In this context, we also employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
  const {
    profileData
  } = useContext(createSomeContext);
  return (
    <>
      {cxo && profileData && profileData.role === 'CXO' && <CXONav />}
      <MoveToAppropriatePanel/>
      <Routes>
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/home" element={<Home />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/profile" element={<Profile />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/taskForm" element={<TaskForm />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/report" element={<CXOReport />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/allAllocatedTaskToUs" element={<AllAllocatedTaskToUs/>} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/bdi-work-report" element={<BDIWorkReport />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/tl-work-report" element={<TLWorkReportCXOView />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/create-tl" element={<CreateTL />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/allTL" element={<ShowAllTL />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/allBDI" element={<ShowAllBDI />} /> }
       { profileData && profileData.role === 'CXO' && <Route exect path="/cxo/handleTaskAllocation" element={<HandleTaskAllocation/>} /> }
      </Routes>
    </>
  )
}

function MD() {
  const location = useLocation();
  const md = location.pathname.startsWith("/md");

  const navigate = useNavigate()
  React.useEffect(() => {
    if (!sessionStorage.getItem("token") && md) {
      navigate("/");
    }
  })

  // Utilize the person's role information from profileData to protect routes from unauthorized access. 
  // In this context, we also employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
  const {
    profileData
  } = useContext(createSomeContext);
  return (
    <>
      {md && profileData && profileData.role === 'MD' && <MDNav />}
      <MoveToAppropriatePanel/>
      <Routes>
       { profileData && profileData.role === 'MD' && <Route exect path="/md/home" element={<Home />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/profile" element={<Profile />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/bdi-work-report" element={<BDIWorkReport />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/tl-work-report" element={<TLWorkReport />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/ceo-work-report" element={<CXOWorkReport />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/create-ceo" element={<CreateCXO />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/allBDI" element={<ShowAllBDI />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/allTL" element={<ShowAllTL />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/allCEO" element={<ShowAllCXO />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/allMD" element={<ShowAllMD />} /> }
       { profileData && profileData.role === 'MD' && <Route exect path="/md/handleTaskAllocation" element={<HandleTaskAllocation/>} /> }
      </Routes>
    </>
  )
}

// //* -------------------------------- Driver Function ----------------------------------------

function App() {
  return (
    <>
      <BrowserRouter>
        <Helmet>
          <title>SAMAS</title>
          <meta
            name="description"
            content="SAMAS : Sales Management System"
          />
          <meta name="keywords" content="Sales Automation, CRM Software, Sales Tracking, Sales Analytics, Sales Reporting, Sales Management System"
          />
          <meta property="og:image"
            content="https://res.cloudinary.com/dzgaixltu/image/upload/v1693552944/logo_cmliyg.webp"
          />
        </Helmet>
        <ToastContainer autoClose={3000} limit={3} />
        <Global />
        <BDI />
        <TL />
        <CXO />
        <MD />
      </BrowserRouter>
    </>
  );
}

export default App;
