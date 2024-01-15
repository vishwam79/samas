import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import MDSidebar from './MDSidebar';

export default function MDNav() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(false);
  }, []);
  return (
    <>  
      <div className="navbar">
        MD Pannel
      </div>
      <div className='logo'>
        <img src="https://res.cloudinary.com/dzgaixltu/image/upload/v1693552944/logo_cmliyg.webp" alt="" onClick={()=>navigate("/md/home")} />
      </div>

      {
        open ? (
          <MDSidebar/>
        )
        :
        ('')
      }

      <div className='navbar-toggle-test'>
        <button
          type='button'
          onClick={(e) => { setOpen(!open) }}>
          {open ? <FontAwesomeIcon icon={faTimes} style={{ color: "white" }} /> : <FontAwesomeIcon icon={faBars} style={{ color: "white" }} />}
        </button>
      </div>
    </>
  )
}
