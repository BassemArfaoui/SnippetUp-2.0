import React, {  useContext } from 'react'
import './styles/choice.css'
import SavedPostsSearch from './saved-posts/SavedPostsSearch'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../tools/styles/driver.css"
import CustomTooltip from '../tools/CustomTooltip';
import userContext from "../contexts/userContext";




function SavedChoice(props) {


  const {user}= useContext(userContext) ;
  const userId=user.id ;


  function startGuide()
  {

   
    const steps = [
      { element: '#saved-posts', popover: { title: 'Saved Posts', description: 'Access your saved posts whenever you need them' }},
      { element: '#local-snippets', popover: { title: 'Local Snippets', description: 'Store code snippets locally, and share them with the community whenever you want' }},
      { element: '#search-saved', popover: { title: 'Search', description: 'search through your saved posts and local snippets to easily find what you need.' }},
    ];
    
    

    //driver
    const driverObj = driver({
      showProgress: true,
      steps: steps
    });

    driverObj.drive();
  }
 
 
  

  return (
    <div className="saved-choice-container d-flex justify-content-center align-items-center flex-column gap-3">
      <div className="d-flex choice-sub-container">
        <span id="saved-posts">
          {props.choice === "posts" ? (
            <div className=" bg-primary text-light left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center text-light">
              Saved Posts
            </div>
          ) : (
            <div
              className=" bg-light text-dark left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center text-light"
              onClick={() => {
                props.setLocalSearch("");
                props.setPostsSearch("");
                props.setIsFiltering("none");
                props.setChoice("posts");
              }}
            >
              Saved Posts
            </div>
          )}
        </span>

        <span id="local-snippets">
          {props.choice === "local" ? (
            <div className="right-choice fs-5 px-3 text-light fw-bold bg-primary text-light d-flex align-items-center justify-content-center">
              Local Snippets
            </div>
          ) : (
            <div
              className="right-choice bg-light text-dark fs-5 px-3 fw-bold d-flex align-items-center justify-content-center"
              onClick={() => {
                if (props.isFiltering !== "none") {
                  props.setIsFiltering("none");
                }
                props.setLocalSearch("");
                props.setPostsSearch("");
                props.setChoice("local");
              }}
            >
              Local Snippets
            </div>
          )}
        </span>
      </div>

      <span id="search-saved">
        <SavedPostsSearch
          choice={props.choice}
          setIsSearching={props.setIsSearching}
          postsSearch={props.postsSearch}
          localSearch={props.localSearch}
          setLocalSearch={props.setLocalSearch}
          setPostsSearch={props.setPostsSearch}
          isFiltering={props.isFiltering}
          cancelFilter={props.cancelFilter}
        />
      </span>
      

      <CustomTooltip title='Explain' placement='right'>
        <span
          onClick={startGuide}
          className="text-secondary rounded-5 d-flex justify-content-center align-items-center fw-light border-secondary position-absolute top-0 end-0 me-2 mt-1"
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


    </div>
  );
}

export default SavedChoice