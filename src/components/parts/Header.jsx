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
import {useNavigate} from 'react-router-dom'
import CustomTooltip from "../tools/CustomTooltip";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../tools/styles/driver.css"

function Header()
{
  const location = useLocation();
  const navigate = useNavigate();

  //key event useeffect
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        switch (event.key) {
          case "h":
            navigate("/");
            break;
          case "s":
            navigate("/saved");
            break;
          case "p":
            navigate("/profile");
            break;
          case "t":
            navigate("/settings");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]); 


  //menu buttons useEffect
  useEffect(() => {
    updateMenuButton();
  }, [location.pathname]);


  //menu buttons func
  function updateMenuButton() {
    const btn = document.querySelectorAll('.menu-btn');
  
    btn.forEach(element => {
      if ( element.name == '/' && location.pathname === element.name) 
      {
        element.classList.add('active');
      }
      else if (location.pathname.startsWith(element.name) && element.name !== '/') {
        element.classList.add('active');
      } 
      else {
        element.classList.remove('active');
      }
    });
  }

  function startGuide()
  {

   
      const steps = [
        { element: '#home', popover: { title: 'Home', description: 'Discover a curated selection of content tailored to your interests and preferences.' }},
        { element: '#saved', popover: { title: 'Saved Items', description: 'Your saved posts are just one click away, ready for you to revisit whenever you need them.' }},
        { element: '#add-btn', popover: { title: 'Add Content', description: 'Contribute by adding valuable content to assist the community.' }},
        { element: '#profile', popover: { title: 'Profile Page', description: 'Access your personal informations and the contributions you’ve made.' }},
        { element: '#settings', popover: { title: 'Settings', description: 'Customize your experience by adjusting your preferences here.' }},
        { element: '#search', popover: { title: 'Search', description: 'Quickly locate the code snippets you need for your programming tasks.' }},
        { element: '#logout', popover: { title: 'Logout', description: 'Don’t be gone for too long!' }},
      ];
    

    

  
    //driver
    const driverObj = driver({
      showProgress: true,
      steps: steps
    });

    driverObj.drive();
  }
 


return (
        <header className=" border-bottom border-3 d-flex align-items-center w-100 position-relative">
                <h1 className="ms-4  fw-bolder position-absolute text-primary" style={{fontSize:'48px'}}>SnippetApp</h1>
                <div className="d-flex gap-4 me-5 align-items-center position-absolute end-0">
                    <CustomTooltip title='Search'>
                      <h4 id="search"><SearchIcon className="mt-1 text-primary" style={{fontSize:'47px'}}/></h4>
                    </CustomTooltip> 

                    <CustomTooltip title='Logout'>
                      <h4 id="logout"><LogoutIcon className="mt-1 text-primary" style={{fontSize:'39px'}} /></h4>
                    </CustomTooltip> 
                </div>
                <div className="d-flex justify-content-center w-100 gap-5">

                        <ul className="d-flex gap-4 m-0">
                            <Link id="home" to="/" className="btn ms-3 menu-btn  d-flex align-items-center active"  name='/' ><HomeIcon style={{fontSize:'44px'}} /></Link>

                            <Link id="saved" to='/saved' className="btn menu-btn  d-flex align-items-center"  name='/saved'><BookmarkIcon style={{fontSize:'41px'}} /></Link>
                            <li id="add-btn" className="add-btn btn bg-warning rounded-circle d-flex justify-content-center align-items-center m-0 " style={{width:'68px',height:'68px'}}><AddIcon style={{fontSize:'65px'}}/></li>

                            <Link id="profile" to='/profile' className="btn menu-btn  d-flex align-items-center" name='/profile'><PersonIcon style={{fontSize:'41px'}}/></Link>

                            <Link id="settings" to='/settings'  className="btn menu-btn  d-flex align-items-center" name='/settings'><SettingsIcon style={{fontSize:'41px'}}/></Link>
                        </ul>
                </div>

                <CustomTooltip title='Explain' placement='right'>
                  <span
                    onClick={startGuide}
                    className="text-secondary rounded-5 d-flex justify-content-center align-items-center fw-light border-secondary position-absolute top-0 end-0 me-1 mt-1"
                    style={{
                      fontSize: "10px",
                      cursor: "pointer",
                      aspectRatio: "1",
                      padding: "1pt",
                      border: "0.5pt solid gray",
                      opacity: "0.65",
                    }}
                  >
                    <QuestionMarkIcon fontSize="50px" />
                  </span>
              </CustomTooltip>

        </header>
    )
}


export default Header