import React from 'react'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import './styles/Notification.css'
import { Divider } from '@mui/material';


function Notification(props) {
    const userName='John Doe';
    const SnippetTitle='Fibonaci function'
  return (
    <div>
      {props.type === "like" && (
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div
            className="noti-btn bg-primary text-light rounded-circle d-flex align-items-center justify-content-center px-2"
            style={{ width: "40px", height: "40px" }}
          >
            <ThumbUpAltIcon />
          </div>
          <div className="w-100">
            <p className="text-muted mb-0 fw-bold">
              <strong className="text-black">{userName} </strong>
              liked your Snippet :
              <strong className="text-black"> {SnippetTitle}</strong>
              <span className="small ms-2"> (2min)</span>
            </p>
          </div>
        </div>
      )}

      {props.type === "dislike" && (
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div
            className="noti-btn bg-danger text-light rounded-circle d-flex align-items-center justify-content-center px-2"
            style={{ width: "40px", height: "40px" }}
          >
            <ThumbDownAltIcon />
          </div>
          <div className="w-100">
            <p className="text-muted mb-0 fw-bold">
              <strong className="text-black">{userName} </strong>
              disliked yourSnippet :
              <strong className="text-black"> {SnippetTitle}</strong>
              <span className="small ms-2"> (2min)</span>
            </p>
          </div>
        </div>
      )}

      {props.type === "comment" && (
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div
            className="noti-btn text-light rounded-circle d-flex align-items-center justify-content-center px-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "rgb(255, 98, 0)",
            }}
          >
            <CommentIcon />
          </div>
          <div className="w-100">
            <p className="text-muted mb-0 fw-bold">
              <strong className="text-black">{userName}</strong> Commented on
              your Snippet :
              <strong className="text-black"> {SnippetTitle}</strong>
              <span className="small ms-2"> (2min)</span>
            </p>
          </div>
        </div>
      )}

      {props.type === "intrested" && (
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div
            className="noti-btn text-light bg-success rounded-circle d-flex align-items-center justify-content-center px-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "rgb(255, 98, 0)",
            }}
          >
            <StarIcon />
          </div>
          <div className="w-100">
            <p className="text-muted mb-0 fw-bold">
              <strong className="text-black">{userName} </strong>
               is now intrested in your Snippets
               <span className='small ms-2'> (2min)</span>
            </p>
          </div>
        </div>
      )}

      {props.type === "share" && (
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div
            className="noti-btn text-light bg-secondary rounded-circle d-flex align-items-center justify-content-center px-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "rgb(255, 98, 0)",
            }}
          >
            <ShareIcon />
          </div>
          <div className="w-100">
            <p className="text-muted mb-0 fw-bold">
              <strong className="text-black">{userName} </strong>
               shared your Snippet : 
               <strong className="text-black"> {SnippetTitle}</strong>
               <span className='small ms-2'> (2min)</span>
            </p>
          </div>
        </div>
      )}

      <Divider/>
    </div>
  );
}

export default Notification