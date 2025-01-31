import React , {useState,useEffect, useRef , useContext} from 'react'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  IconButton } from '@mui/material';
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SpinnerSpan from '../tools/SpinnerSpan';
import { notify, successNotify } from '../tools/CustomToaster';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Link } from 'react-router-dom';
import userContext from "..//contexts/userContext";







function CommentReply(props) {


    const apiUrl = process.env.REACT_APP_API_URL; 

    const [commentReact,setCommentReact]=useState('none');
    const [likeCount,setLikeCount]=useState(props.likeCount)
    const [dislikeCount,setDislikeCount]=useState(props.dislikeCount)
    const [showMore,setShowMore]=useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [replyContent , setReplyContent] = useState(props.content)
    const [editLoading, setEditLoading] = useState(false);
    const [editing, setEditing] = useState(false)
    



    const optionsRef=useRef(null)
    const {user}= useContext(userContext) ;
    const userId=user.id ;


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

    
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const deleteReply = async() => {
    try
    {
      setDeleteLoading(true);
      await axios.delete(`${apiUrl}/${props.userId}/delete-reply/${props.id}`);
      await props.refreshComments();
      setDeleteLoading(false);
      setIsConfirmModalOpen(false);
      successNotify("Reply deleted successfully");
    }
    catch(err)
    {
      setDeleteLoading(false);
      console.error("Couldn't delete the comment", err);  
      notify("Couldn't delete the comment");
  }}


  const startEditing = () => {
    setEditing(true);
    setShowOptions(false);  
  }


  const handleCommentChange = (event) => {
    setReplyContent(event.target.value); 
  };

  const editComment = async () => {
    try {
      setEditLoading(true);
      await axios.put(`${apiUrl}/${props.userId}/edit-comment/${props.id}`, {
        content: replyContent,
      });
      setEditLoading(false);
      setEditing(false);
      successNotify("Comment edited successfully");
    } catch (err) {
      setEditLoading(false);
      console.error("Couldn't edit the comment", err);  
      notify("Couldn't edit the comment");
    }
  };



  return (
    <div
      id="comment"
      className="comment-reply rounded-4 pb-3 pt-3 px-3 fs-5 position-relative "
      style={{ whiteSpace: "pre-wrap" }}
    >
      <div className="d-flex align-items-center mb-2">
        <div className="poster-info d-flex align-items-center gap-2">
        <Link to={`/${props.username}`} className="text-decoration-none text-dark">
        <div className="avatar">
            <img
              src={props.profilePic}
              alt="user"
              className="rounded-circle"
              style={{ width: "45px", height: "45px" }}
            />
          </div>
        </Link>


          <div>
            <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
              <span className="commentor_name p-0 m-0 text-dark">
                <Link
                  to={`/${props.username}`}
                  className="text-decoration-none text-dark"
                >
                  {props.fullname}
                </Link>

                <span className="text-secondary small">
                  ({props.timeSince})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="comment-content fs-5 ">
        <div className="comment-content ms-2 mb-2 pe-3 border border-2 border-dark rounded-4 py-2 px-3">
          {!editing ? (
            <span className="p-0 m-0">
              {!showMore ? (
                <span className="m-0 p-0">
                  {truncateComment(replyContent, 100)}{" "}
                  <span
                    className="text-secondary small fw-bold see-more-btn"
                    onClick={seeMore}
                  >
                    See all
                  </span>
                </span>
              ) : (
                replyContent
              )}
            </span>
          ) : (
            <div className="d-flex align-items-center">
              <textarea
                onChange={handleCommentChange}
                className="w-100 fw-bold text-dark m-0 p-0 border-0 flex-grow-1 small pe-3"
                style={{
                  backgroundColor: "transparent",
                  resize: "none",
                  outline: "none",
                }}
                spellCheck="false"
                value={replyContent}
              />

              <div className="ps-3">
                <button
                  type="submit"
                  className="bg-warning rounded-circle border-0 fs-4 edit-cmnt"
                  disabled={editLoading}
                  onClick={editComment}
                >
                  {!editLoading ? (
                    <DoneRoundedIcon />
                  ) : (
                    <SpinnerSpan
                      color="text-dark"
                      spanStyle={{ width: "25px", height: "25px" }}
                    />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <span className="reactions d-flex justify-content-start  gap-3 align-items-center px-3 ms-5">
        <span className="d-flex align-items-center gap-1">
          <span className="comment-num m-0 p-0 mt-2">{likeCount}</span>
          {commentReact === "like" ? (
            <span onClick={unlikeComment} className="text-primary">
              <ThumbUpAltIcon />
            </span>
          ) : (
            <span onClick={likeComment}>
              <ThumbUpAltIcon />
            </span>
          )}
        </span>

        <span className="d-flex align-items-center gap-1">
          <span className="comment-num m-0 p-0 mt-2">{dislikeCount}</span>
          {commentReact === "dislike" ? (
            <span onClick={undislikeComment} className="text-danger">
              <ThumbDownAltIcon />
            </span>
          ) : (
            <span onClick={dislikeComment}>
              <ThumbDownAltIcon />
            </span>
          )}
        </span>
      </span>

      {userId === props.userId && (
        <div ref={optionsRef}>
          {!showOptions ? (
            <IconButton
              onClick={() => setShowOptions(true)}
              className="position-absolute"
              style={{ right: "10px", top: "10px" }}
              disabled={editing}
            >
              <MoreHorizIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => setShowOptions(false)}
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
              <div
                className="option text-center py-1 px-4"
                style={{ cursor: "pointer" }}
                onClick={startEditing}
              >
                Edit
              </div>
              <div
                className="option text-center py-1 px-4 text-danger"
                style={{ borderTop: "1.5pt solid darkgray", cursor: "pointer" }}
                onClick={() => {
                  setIsConfirmModalOpen(true);
                }}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      )}

      {/* delete confirmtion modal */}
      <Modal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
            maxHeight: "95vh",
            overflowY: "auto",
            width: "clamp(400px , 100% , 500px)",
            backgroundColor: "#1E1E1E",
            color: "white",
            border: "2px solid darkgray",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeConfirmModal}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
            }}
            disabled={deleteLoading}
          >
            <CloseIcon className="fs-2" />
          </IconButton>

          <h3 id="modal-title" className="fw-bold mb-4 mt-4 text-center fs-5">
            Are you sure you want to delete this reply ?
          </h3>

          <div className="d-flex gap-3  justify-content-center align-items-center mt-4">
            <button
              className="btn border-2 rounded-4 fw-bold border-secondary text-secondary fs-6 lh-base small"
              onClick={closeConfirmModal}
              disabled={deleteLoading}
            >
              Cancel
            </button>

            <button
              className=" btn border-2 border-danger text-danger fw-bold fs-6 lh-base rounded-4"
              onClick={deleteReply}
            >
              {deleteLoading ? (
                <SpinnerSpan
                  color="text-danger"
                  spanStyle={{ width: "22px", height: "22px" }}
                />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CommentReply