import React, { useState, useEffect, useCallback, useRef } from 'react';
import profile_pic from '../../imgs/profile_pic.jpg';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { FaReply } from 'react-icons/fa';
import CommentReply from './CommentReply';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { CircularProgress, IconButton } from '@mui/material';
import { notify, successNotify } from '../tools/CustomToaster';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SpinnerSpan from '../tools/SpinnerSpan';



function Comment(props) {

    
    const apiUrl = process.env.REACT_APP_API_URL; 
    const [commentReact, setCommentReact] = useState('none');
    const [likeCount, setLikeCount] = useState(props.likeCount);
    const [dislikeCount, setDislikeCount] = useState(props.dislikeCount);
    const [commentContent, setCommentContent] = useState(props.content);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [repliesCount, setRepliesCount] = useState(0);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [repliesPage, setRepliesPage] = useState(1);
    const [showMore,setShowMore]=useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editing, setEditing] = useState(false)


    const limit = 3; 
    const userId = 1;
    const optionsRef = useRef(null)

    useEffect(() => {
      if (props.isLiked) {
        setCommentReact("like");
      } else if (props.isDisliked) {
        setCommentReact("dislike");
      }
    }, [props.isLiked, props.isDisliked]);

    useEffect(() => {
      const updateRepliesTotal = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/comments/${props.id}/repliesCount`
          );
          setRepliesCount(response.data.totalReplies);
        } catch (err) {
          notify("Error updating replies total");
        }
      };

      updateRepliesTotal();
      fetchReplies();
    }, []);

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
    

      const handleCommentChange = (event) => {
        setCommentContent(event.target.value); 
      };
    

    const fetchReplies = useCallback(async () => {
      if (loadingReplies) return;

      setLoadingReplies(true);
      try {
        const response = await axios.get(
          `${apiUrl}/comments/${props.id}/replies`,
          {
            params: {
              limit: limit,
              offset: (repliesPage - 1) * limit,
            },
          }
        );

        if (response.data.replies.length < limit) {
          setHasMoreReplies(false);
        }

        setReplies((prevReplies) => [...prevReplies, ...response.data.replies]);
        setRepliesPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    }, [loadingReplies, repliesPage, props.id]);

    const seeReplies = () => {
      if (repliesCount > 0) {
        setShowReplies(true);
      }
    };

    const hideReplies = () => {
      setShowReplies(false);
    };

    const likeComment = async () => {
      try {
        if (commentReact === "dislike") {
          await undislikeComment();
        }
        await axios.get(`${apiUrl}/likeComment/${userId}/${props.id}`);
        setCommentReact("like");
        setLikeCount((prev) => prev + 1);
      } catch (err) {
        console.error("Couldn't like the comment", err);
      }
    };

    const unlikeComment = async () => {
      try {
        await axios.get(`${apiUrl}/unlikeComment/${userId}/${props.id}`);
        setCommentReact("none");
        setLikeCount((prev) => prev - 1);
      } catch (err) {
        console.error("Couldn't unlike the comment", err);
      }
    };

    const dislikeComment = async () => {
      try {
        if (commentReact === "like") {
          await unlikeComment();
        }
        await axios.get(`${apiUrl}/dislikeComment/${userId}/${props.id}`);
        setCommentReact("dislike");
        setDislikeCount((prev) => prev + 1);
      } catch (err) {
        console.error("Couldn't dislike the comment", err);
      }
    };

    const undislikeComment = async () => {
      try {
        await axios.get(`${apiUrl}/undislikeComment/${userId}/${props.id}`);
        setCommentReact("none");
        setDislikeCount((prev) => prev - 1);
      } catch (err) {
        console.error("Couldn't undislike the comment", err);
      }
    };

    const timeSince = (time) => {
      const now = new Date();
      const timeDiff = now - new Date(time);

      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
      }
    };

    const handleReplyClick = () => {
      props.updateCommentToReply({
        commentId: props.id,
        commentorName: props.firstname + " " + props.lastname,
      });
    };

    function truncateComment(str, n) {
      const lineBreakCount = (str.match(/\n/g) || []).length;

      if (str.length <= n && lineBreakCount <= 2) {
        setShowMore(true);
        return str;
      } else {
        const truncatedStr = str.split("\n").slice(0, 2).join("\n") + "\n...";
        return truncatedStr;
      }
    }

    const seeMore = () => {
      setShowMore(true);
    };


    const openConfirmModal = () => {
      setShowOptions(false)
      setIsConfirmModalOpen(true);
    };
  
    const closeConfirmModal = () => {
      setIsConfirmModalOpen(false);
    };


    const deleteComment =  async() => {
      try
      {
        setDeleteLoading(true);
        await axios.delete(`${apiUrl}/${props.userId}/delete-comment/${props.id}`);
        props.filterComments(props.id);
        setDeleteLoading(false);
        setIsConfirmModalOpen(false);
        successNotify("Comment deleted successfully");
      }
      catch(err)
      {
        setDeleteLoading(false);
        console.error("Couldn't delete the comment", err);  
        notify("Couldn't delete the comment");
    }}

    const handleFilter = (id) => {
      setReplies((prevReplies) => prevReplies.filter((reply) => reply.id !== id)); 
      setRepliesCount((prevRepliesCount => prevRepliesCount - 1));
    };

    const startEditing = () => {
      setEditing(true);
      setShowOptions(false);  
    }

    const editComment = async () => {
      try {
        setEditLoading(true);
        await axios.put(`${apiUrl}/${props.userId}/edit-comment/${props.id}`, {
          content: commentContent,
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
        className="comment rounded-4 pb-3 pt-3 px-3 fs-5 position-relative"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <div className="d-flex align-items-center mb-2">
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
                <span className="commentor_name p-0 m-0 text-dark">
                  {props.firstname + " " + props.lastname}
                  <span className="text-secondary small"> ({props.time})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="comment-content fs-5">
          <div className="comment-content ms-2 mb-2 pe-3 border border-2 border-dark rounded-4 py-2 px-3">
            {!editing ? (
              <span className="p-0 m-0">
                {!showMore ? (
                  <span className="m-0 p-0">
                    {truncateComment(commentContent, 100)}{" "}
                    <span
                      className="text-secondary small fw-bold see-more-btn"
                      onClick={seeMore}
                    >
                      See all
                    </span>
                  </span>
                ) : (
                  commentContent
                )}
              </span>
            ) : (
              <div className="d-flex align-items-center">
                <textarea
                  onChange={handleCommentChange}
                  className="w-100 fw-bold text-dark m-0 p-0 border-0 flex-grow-1 small pe-2"
                  style={{
                    backgroundColor: "transparent",
                    resize: "none",
                    outline: "none",
                  }}
                  spellCheck="false"
                  value={commentContent}
                />

                <div className='ps-3'>
                  <button
                    type="submit"
                    className="bg-warning rounded-circle border-0 fs-4 edit-cmnt"
                    disabled={editLoading}
                    onClick={editComment}
                  >
                    {!editLoading ? (
                      <DoneRoundedIcon />
                    ) : (
                      <SpinnerSpan color="text-dark" spanStyle={{width:'25px' , height : '25px'}} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="reactions d-flex justify-content-start gap-3 align-items-center px-3 ms-5">
          <span className="d-flex align-items-center">
            {commentReact === "like" ? (
              <span
                onClick={unlikeComment}
                className="d-flex align-items-center"
              >
                <span className="comment-num m-0 p-0 mt-2 me-1 text-primary">
                  {likeCount}
                </span>
                <span className="text-primary">
                  <ThumbUpAltIcon />
                </span>
              </span>
            ) : (
              <span onClick={likeComment} className="d-flex align-items-center">
                <span className="comment-num m-0 p-0 mt-2 mb-0 me-1">
                  {likeCount}
                </span>
                <span>
                  <ThumbUpAltIcon />
                </span>
              </span>
            )}
          </span>

          <span className="d-flex align-items-center gap-1">
            {commentReact === "dislike" ? (
              <span onClick={undislikeComment}>
                <span className="comment-num m-0 p-0 mt-2 me-1 text-danger">
                  {dislikeCount}
                </span>
                <span className="text-danger">
                  <ThumbDownAltIcon />
                </span>
              </span>
            ) : (
              <span onClick={dislikeComment}>
                <span className="comment-num m-0 p-0 mt-2 me-1">
                  {dislikeCount}
                </span>
                <span>
                  <ThumbDownAltIcon />
                </span>
              </span>
            )}
          </span>

          <span className="d-flex align-items-center gap-1">
            {!showReplies ? (
              <span onClick={seeReplies}>
                <span className="comment-num m-0 p-0 mt-1 me-1">
                  {repliesCount}
                </span>
                <span>
                  <BiSolidCommentDetail />
                </span>
              </span>
            ) : (
              <span onClick={hideReplies}>
                <span className="comment-num m-0 p-0 mt-1 me-1 text-secondary">
                  {repliesCount}
                </span>
                <span className="text-secondary">
                  <BiSolidCommentDetail />
                </span>
              </span>
            )}
          </span>

          <span className="reply-btn ms-2" onClick={handleReplyClick}>
            <FaReply />
          </span>
        </span>

        {showReplies && (
          <div className="replies d-flex flex-column gap-2 ms-5 mt-3">
            {replies.map((reply, index) => (
              <CommentReply
                key={reply.id}
                id={reply.id}
                userId={reply.user_id}
                fullname={reply.firstname + " " + reply.lastname}
                content={reply.content}
                time={reply.commented_at}
                likeCount={reply.like_count}
                dislikeCount={reply.dislike_count}
                isLiked={reply.liked}
                isDisliked={reply.disliked}
                timeSince={timeSince(reply.commented_at)}
                filterReplies={handleFilter}
                refreshComments={props.refreshComments}
              />
            ))}

            {loadingReplies && (
              <div className="d-flex justify-content-center my-3">
                <CircularProgress color="primary" />
              </div>
            )}

            {!loadingReplies &&
              (!hasMoreReplies || repliesCount - replies.length == 0) && (
                <div className="d-flex justify-content-center my-3 fw-bold small">
                  <p className="small text-secondary ">No more replies</p>
                </div>
              )}

            {hasMoreReplies &&
              !loadingReplies &&
              repliesCount - replies.length !== 0 && (
                <div className="d-flex justify-content-center my-3">
                  <IconButton onClick={fetchReplies} aria-label="Load More">
                    <p className="text-primary small fw-bold fs-6">
                      {repliesCount - replies.length} more{" "}
                      {repliesCount - replies.length != 1 ? "replies" : "reply"}
                    </p>
                  </IconButton>
                </div>
              )}
          </div>
        )}

        {/* options */}
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
                className="options position-absolute end-0 bg-light py-2 rounded-4 me-3"
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
                  style={{
                    borderTop: "1.5pt solid darkgray",
                    cursor: "pointer",
                  }}
                  onClick={openConfirmModal}
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
              Are you sure you want to delete this comment ?
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
                onClick={deleteComment}
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

export default Comment;
