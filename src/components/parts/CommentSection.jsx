import React, { useState, useEffect, useCallback , useRef } from 'react';
import { Box, IconButton, CircularProgress, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import RefreshIcon from '@mui/icons-material/Refresh';  // Add the refresh icon
import axios from 'axios';
import Comment from './Comment';
import './styles/Comment.css';
import { notify } from '../tools/CustomToaster';
import AddComment from './AddComment';

function CommentSection(props) {
  const userId = 1;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); 
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [reset, setReset] = useState(false);
  const [isReply,setIsReply]=useState(false);
  const [commentToReply,setCommentToReply]=useState({});

  //refs
  const commentsRef = useRef(null);

  const limit = 30;

  // Fetch comments function
  const fetchComments = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/${props.postId}/${userId}/comments`, {
        params: {
          page: page,
          limit: limit
        }
      });

      if (response.data.length < limit) {
        setHasMore(false);
      }

      

      setComments(prevComments => [...prevComments, ...response.data]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
      notify("Failed to Load Comments");
    } finally {
      setLoading(false);
      setInitialLoading(false); 
    }
  }, [loading, page, props.postId]);

  useEffect(() => {
   
      fetchComments();
  
  }, []);


  useEffect(() => {
    if (reset) {
     
        fetchComments();
      
      setReset(false);  
    }
  }, [reset]);


 const handleRefresh = () => {
  setInitialLoading(true);
  setComments([]);
  setHasMore(true);
  setPage(1);
  setReset(true);
};


const refreshAndScroll = () => {
  handleRefresh();
  scrollToTop();
}


  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchComments();
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
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds<=0 )
    {
      return 'now';
    }
    else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };


  const updateCommentToReply = (comment) =>
  {
    setIsReply(true);
    setCommentToReply(comment);
  }


  const scrollToTop = ()=> {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "16px",
          minHeight: "95vh",
          maxHeight: "95vh",
          width: "80%",
          backgroundColor: "#1E1E1E",
          color: "white",
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={() => {
            props.closeComments();
          }}
          sx={{
            position: "absolute",
            top: "10px",
            right: "8px",
            color: "white",
          }}
        >
          <CloseIcon className="fs-2" />
        </IconButton>

        {/* Refresh button */}
        <IconButton
          aria-label="refresh"
          onClick={refreshAndScroll}
          sx={{
            position: "absolute",
            top: "10px",
            left: "3px",
            color: "white",
          }}
        >
          <RefreshIcon className="fs-2" />
        </IconButton>

        <div className="comments-body d-flex flex-column ">
          <div
          ref={commentsRef}
            className="comments"
            style={{ height: "80vh", overflowY: "auto" }}
          >
            <h2 className="text-center p-0 text-warning fw-bold mt-4 mx-3 lh-base fs-4">
              {props.postTitle}
              <span className="text-light"> Comments</span>
            </h2>

            <div className="space" style={{ marginTop: "50px" }}></div>

            <div className="d-flex flex-column gap-4 px-5">
              {initialLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="comment-skeleton mb-4">
                    <div className="d-flex gap-3 mb-2 align-items-center">
                      <Skeleton
                        variant="circular"
                        width={50}
                        height={50}
                        sx={{ bgcolor: " rgba(182, 207, 226, 0.800)" }}
                      />
                      <Skeleton
                        variant="text"
                        height={40}
                        sx={{
                          bgcolor: "rgba(182, 207, 226, 0.800)",
                          flexGrow: "1",
                          marginRight: "6px",
                        }}
                      />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={170}
                      sx={{
                        bgcolor: "rgba(182, 207, 226, 0.800)",
                        borderRadius: "15px",
                      }}
                    />
                  </div>
                ))
              ) : comments.length === 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center my-3 fw-bold"
                  style={{ minHeight: "60vh" }}
                >
                  <p>No comments yet</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    content={comment.content}
                    likeCount={comment.like_count}
                    dislikeCount={comment.dislike_count}
                    firstname={comment.firstname}
                    lastname={comment.lastname}
                    profilePic={comment.profile_pic}
                    time={timeSince(comment.commented_at)}
                    isLiked={comment.liked}
                    isDisliked={comment.disliked}
                    updateCommentToReply={updateCommentToReply}
                  />
                ))
              )}
              {loading && !initialLoading && (
                <div className="d-flex justify-content-center my-3">
                  <CircularProgress color="primary" />
                </div>
              )}
              {comments.length > 0 && !hasMore && !loading && (
                <div className="d-flex justify-content-center my-3 fw-bold">
                  <p className="text-secondary">No more comments</p>
                </div>
              )}
            </div>
            {hasMore && !loading && (
              <div className="d-flex justify-content-center my-3">
                <IconButton onClick={handleLoadMore} aria-label="Load More">
                  <ExpandMoreIcon
                    className="text-primary"
                    style={{ fontSize: "62px" }}
                  />
                </IconButton>
              </div>
            )}
          </div>

          <div
            style={{ height: "15vh" }}
            className="d-flex justify-content-center align-items-center px-5"
          >
           {  !isReply ?
              <AddComment
              addComment={props.addComment}
              refreshComments={handleRefresh}
              scrollToTop={scrollToTop}
              /> :
              <AddComment
              addComment={props.addComment}
              refreshComments={handleRefresh}
              reply 
              commentToReply={commentToReply}
              setIsReply={setIsReply}
              />
            }
          </div>
        </div>
      </Box>
    </div>
  );
}

export default CommentSection;
