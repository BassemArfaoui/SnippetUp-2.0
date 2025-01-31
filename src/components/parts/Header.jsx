import React , {useEffect , lazy , Suspense , useState , useContext} from "react";
import './styles/Header.css'
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import { FaCode } from "react-icons/fa6";

import { Link , useLocation  } from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import CustomTooltip from "../tools/CustomTooltip";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../tools/styles/driver.css";
import userContext from "../contexts/userContext";
import { successNotify } from "../tools/CustomToaster";


const PostAddModal = lazy(() => import("../main/PostAddModal"));


function Header()
{

  const {user}= useContext(userContext) ;
  const userId=user.id ;
  const username = user.username || 'profile';
  const [isAdding, setIsAdding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const[stage,setStage]=useState(1)
  const location = useLocation();
  const navigate = useNavigate();


  const openAddModel = () =>
  {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () =>
  {
    setIsAddModalOpen(false);
    setStage(1)
  }

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
            navigate(`/${username}`);
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
      console.log(element.name , location.pathname)
      if ( element.name == '/' && location.pathname === element.name) 
      {
        element.classList.add('active');
      }
      else if (location.pathname.startsWith(element.name) && element.name !== '/' || username ===location.pathname) {
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
        { element: '#demands', popover: { title: 'Demands Section', description: "Ask for a Specific Snippets or Provide Snippets for other's Demands" }},
        { element: '#profile', popover: { title: 'Profile Page', description: 'Access your personal informations and the contributions you’ve made.' }},
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


  const logoutUser = () => {
    localStorage.removeItem("token");
  
    successNotify("Logged out successfully. See you soon!");
  
    window.location.href = "/login"; 
  };
  
 


return (
  <>
    {location.pathname !== "/login" && (
      <header className=" border-bottom border-3 d-flex align-items-center w-100 position-relative">
        <h1
          className="ms-3 fw-bold position-absolute text-primary d-flex align-items-center d-flex align-items-center"
          style={{ fontSize: "36px" }}
        >
          <span className="me-2 my-0">
            <FaCode style={{ fontSize: "45px" }} />
          </span>
          <span style={{ fontSize: "35px" }}>SnippetUp</span>
        </h1>
        <div className="d-flex gap-4 me-4 align-items-center position-absolute end-0">
          <CustomTooltip title="Search">
            <h4 id="search">
              <SearchIcon
                className="mt-1 text-primary"
                style={{ fontSize: "43px" }}
              />
            </h4>
          </CustomTooltip>
          <CustomTooltip title="Logout">
            <h4 id="logout" onClick={logoutUser}>
              <LogoutIcon
                className="mt-1 text-primary"
                style={{ fontSize: "35px" , cursor:'pointer' }}
              />
            </h4>
          </CustomTooltip>
        </div>
        <div className="d-flex justify-content-center w-100 gap-5">
          <ul className="d-flex gap-4 m-0">
            <Link
              id="home"
              to="/"
              className="btn ms-3 menu-btn d-flex align-items-center active"
              name="/"
            >
              <HomeIcon style={{ fontSize: "39px" }} />
            </Link>
            <Link
              id="saved"
              to="/saved"
              className="btn menu-btn  d-flex align-items-center"
              name="/saved"
            >
              <BookmarkIcon style={{ fontSize: "35px" }} />
            </Link>
            <li
              id="add-btn"
              className="add-btn btn bg-warning rounded-circle d-flex justify-content-center align-items-center m-0 "
              style={{ width: "59px", height: "59px" }}
              onClick={openAddModel}
            >
              <AddIcon style={{ fontSize: "52px" }} />
            </li>
            <Link
              id="demands"
              to="/demands"
              className="btn menu-btn  d-flex align-items-center"
              name="/demands"
            >
              <HandshakeIcon style={{ fontSize: "35px" }} />
            </Link>
            <Link
              id="profile"
              to={`/${username || "profile"}`}
              className="btn menu-btn  d-flex align-items-center"
              name={`/${username}`}
            >
              <PersonIcon style={{ fontSize: "39px" }} />
            </Link>
          </ul>
        </div>
        <CustomTooltip title="Explain" placement="right">
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
        <div>
          <Suspense fallback="test">
            <PostAddModal
              closeAddModal={closeAddModal}
              openAddModel={openAddModel}
              isAddModalOpen={isAddModalOpen}
              stage={stage}
              setStage={setStage}
            />
          </Suspense>
        </div>
      </header>
    )}
  </>
);
}


export default Header