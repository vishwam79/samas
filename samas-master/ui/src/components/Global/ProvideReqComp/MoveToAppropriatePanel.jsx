// we employ the MoveToAppropriatePanel component to facilitate redirection to the appropriate panel.
import { useLocation } from 'react-router-dom';
import createSomeContext from '../../../context/createSomeContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function MoveToAppropriatePanel() {
  const location = useLocation();
  const bdi = location.pathname.startsWith('/bdi/');
  const tl = location.pathname.startsWith('/tl');
  const cxo = location.pathname.startsWith("/cxo");
  const md = location.pathname.startsWith("/md");
  
  const {
    profileData
  } = useContext(createSomeContext);

  const navigate = useNavigate();
  
  useEffect(()=>{
    if(profileData)
    {
      if(profileData.role === "BDI" && !bdi)
      {
        navigate('/bdi/home');
      }
      else if(profileData.role === 'TL' && !tl)
      {
        navigate('/tl/home');
      }
      else if(profileData.role === 'CXO' && !cxo)
      {
        navigate('/cxo/home');
      }
      else if(profileData.role === 'MD' && !md)
      {
        navigate('/md/home');
      }
    }
    // eslint-disable-next-line
  },[profileData]);
  return (
   null
  )
}
