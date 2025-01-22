import React , {useState,useEffect, useRef} from 'react'
import profile_pic from '../../imgs/profile_pic.jpg'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  IconButton } from '@mui/material';





function CommentReply(props) {
    const [commentReact,setCommentReact]=useState('none');
    const [likeCount,setLikeCount]=useState(props.likeCount)
    const [dislikeCount,setDislikeCount]=useState(props.dislikeCount)
    const [showMore,setShowMore]=useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [editing, setEditing] = useState(false)

    const optionsRef=useRef(null)
    const userId=1;


    useEffect(() => {
      if (props.isLiked) {
          setCommentReact('like');
      } else if (props.isDisliked) {
          setCommentReact('dislike');
      }

  }, [props.isLiked, props.isDisliked]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);




   function truncateComment(str, n) {
    const lineBreakCount = (str.match(/\n/g) || []).length;
  
    if (str.length <= n && lineBreakCount <= 2) {
      setShowMore(true);
      return str;
    } else {
      const truncatedStr = str.split('\n').slice(0, 2).join('\n') + '\n...';
      return truncatedStr;
    }
    }
  

    const seeMore = () =>
    {
        setShowMore(true);
    }


   
    const likeComment = async () => {
      try {
          if (commentReact === 'dislike') {
              await undislikeComment();
          }
          await axios.get(`${process.env.REACT_APP_API_URL}/likeComment/${userId}/${props.id}`);
          setCommentReact('like');
          setLikeCount((prev) => prev + 1);
      } catch (err) {
          console.error("Couldn't like the comment", err);
      }
  };

  const unlikeComment = async () => {
      try {
          await axios.get(`${process.env.REACT_APP_API_URL}/unlikeComment/${userId}/${props.id}`);
          setCommentReact('none');
          setLikeCount((prev) => prev - 1);
      } catch (err) {
          console.error("Couldn't unlike the comment", err);
      }
  };

  const dislikeComment = async () => {
      try {
          if (commentReact === 'like') {
              await unlikeComment();
          }
          await axios.get(`${process.env.REACT_APP_API_URL}/dislikeComment/${userId}/${props.id}`);
          setCommentReact('dislike');
          setDislikeCount((prev) => prev + 1);
      } catch (err) {
          console.error("Couldn't dislike the comment", err);
      }
  };

  const undislikeComment = async () => {
      try {
          await axios.get(`${process.env.REACT_APP_API_URL}/undislikeComment/${userId}/${props.id}`);
          setCommentReact('none');
          setDislikeCount((prev) => prev - 1);
      } catch (err) {
          console.error("Couldn't undislike the comment", err);
      }
  };



  return (
       <div id="comment" className="comment-reply rounded-4 pb-3 pt-3 px-3 fs-5 position-relative " style={{ whiteSpace: "pre-wrap" }}>
          <div className="d-flex align-items-center mb-2" >
            <div className="poster-info d-flex align-items-center gap-2">

              <div className="avatar">
                <img
                  src={profile_pic}
                  alt="user"
                  className="rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                />
              </div>

              <div>
                <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
                  <span className="commentor_name p-0 m-0 text-dark">{props.fullname}<span className='text-secondary small'> ({props.timeSince})</span> </span>
                </div>
              </div>

            </div>
          </div>

          <div className='comment-content fs-5 '>
            <div className='comment-content ms-2 mb-2 pe-3 border border-2 border-dark rounded-4 py-2 px-3'>
                <span className='p-0 m-0'> {!showMore ? <span className='m-0 p-0'>{truncateComment(props.content,100)} <span className='text-secondary small fw-bold see-more-btn' onClick={seeMore}>See all</span></span> : props.content}</span> 
            </div>
          </div>

            <span className='reactions d-flex justify-content-start  gap-3 align-items-center px-3 ms-5'>

                <span className='d-flex align-items-center gap-1'>
                    <span className='comment-num m-0 p-0 mt-2'>{likeCount}</span>
                    {commentReact==='like' ?  <span onClick={unlikeComment} className='text-primary'><ThumbUpAltIcon/></span> : <span onClick={likeComment}><ThumbUpAltIcon/></span>   }
                </span>

                <span className='d-flex align-items-center gap-1'>
                    <span className='comment-num m-0 p-0 mt-2'>{dislikeCount}</span>
                    {commentReact==='dislike' ?  <span onClick={undislikeComment} className='text-danger'><ThumbDownAltIcon/></span> : <span onClick={dislikeComment}><ThumbDownAltIcon/></span> }
                </span>

                
            </span>
          
            {userId === props.userId && (
          <div ref={optionsRef}>
            {!showOptions ? (
              <IconButton
                onClick={() => setShowOptions(!showOptions)}
                className="position-absolute"
                style={{ right: "10px", top: "10px" }}
              >
                <MoreHorizIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => setShowOptions(!showOptions)}
                className="position-absolute"
                style={{ right: "10px", top: "10px" }}
              >
                <MoreHorizIcon className="text-primary" />
              </IconButton>
            )}

            {showOptions && (
              <div
                className="options position-absolute end-0 bg-light py-2 rounded-4"
                style={{ top: "45px" }}
              >
                <div className="option text-center py-1 px-4" style={{cursor:'pointer'}}>Edit</div>
                <div className="option text-center py-1 px-4" style={{borderTop:'1.5pt solid darkgray', cursor : 'pointer'}}>Delete</div>
              </div>
            )}
          </div>
        )}

        </div>
  )
}

export default CommentReply