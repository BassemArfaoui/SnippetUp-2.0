import React , {useEffect} from "react";
import './styles/Header.css'
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { Link , useLocation } from "react-router-dom";

function Header()
{
  const location = useLocation();

  useEffect(() => {
    updateMenuButton();
  }, [location.pathname]);

  function updateMenuButton() {
    const btn = document.querySelectorAll('.menu-btn');

    btn.forEach(element => {
        if (element.name === location.pathname) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
   }
 




  

return (
        <header className=" border-bottom border-3 d-flex align-items-center w-100 position-relative">
                <h1 className="ms-4  fw-bolder position-absolute text-primary" style={{fontSize:'48px'}}>SnippetApp</h1>
                <div className="d-flex gap-4 me-5 align-items-center position-absolute end-0">
                    <h4><SearchIcon className="mt-1 text-primary" style={{fontSize:'47px'}}/></h4>
                    <h4><LogoutIcon className="mt-1 text-primary" style={{fontSize:'39px'}} /></h4>
                </div>
                <div className="d-flex justify-content-center w-100 gap-5">

                        <ul className="d-flex gap-4 m-0">
                            <Link to="/" className="btn ms-3 menu-btn  d-flex align-items-center active"  name='/' ><HomeIcon style={{fontSize:'44px'}} /></Link>
                            <Link to='/saved' className="btn menu-btn  d-flex align-items-center"  name='/saved'><BookmarkIcon style={{fontSize:'41px'}} /></Link>
                            <li className="add-btn btn bg-warning rounded-circle d-flex justify-content-center align-items-center m-0 " style={{width:'70px',height:'70px'}}><AddIcon style={{fontSize:'65px'}}/></li>
                            <Link to='/profile' className="btn menu-btn  d-flex align-items-center" name='/profile'><PersonIcon style={{fontSize:'41px'}}/></Link>
                            <Link to='/settings'  className="btn menu-btn  d-flex align-items-center" name='/settings'><SettingsIcon style={{fontSize:'41px'}}/></Link>
                        </ul>
                </div>

        </header>
    )
}


export default Header