import React from "react";
import './styles/Header.css'
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

function Header()
{
     
function menuButtonClicked(e)
{
    e.preventDefault();
    const btn=document.querySelectorAll('.menu-btn');
    btn.forEach(element => {
        element.classList.remove('active');
    });
    e.target.classList.add('active');
}

function handleIconClick(e) {
    e.preventDefault(); 
  
    const btn = document.querySelectorAll('.menu-btn');
    btn.forEach(element => {
      element.classList.remove('active');
    });
  
    const clickedMenuBtn = e.target.closest('.menu-btn');
    if (clickedMenuBtn) {
      clickedMenuBtn.classList.add('active');
    }
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
                            <li className="btn ms-3 menu-btn  d-flex align-items-center active" onClick={menuButtonClicked}><HomeIcon style={{fontSize:'44px'}}  onClick={handleIconClick}/></li>
                            <li className="btn menu-btn  d-flex align-items-center" onClick={menuButtonClicked}><BookmarkIcon style={{fontSize:'41px'}} onClick={handleIconClick}/></li>
                            <li className="btn bg-warning rounded-circle d-flex justify-content-center align-items-center m-0 " style={{width:'70px',height:'70px'}} onClick={handleIconClick}><AddIcon style={{fontSize:'65px'}} onClick={menuButtonClicked}/></li>
                            <li className="btn menu-btn  d-flex align-items-center" onClick={menuButtonClicked}><PersonIcon style={{fontSize:'41px'}} onClick={handleIconClick}/></li>
                            <li className="btn menu-btn  d-flex align-items-center" onClick={menuButtonClicked}><SettingsIcon style={{fontSize:'41px'}} onClick={handleIconClick}/></li>
                        </ul>
                </div>

        </header>
    )
}


export default Header