import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Material-UI Icon
import axios from 'axios';
import Comment from './Comment';
import './styles/Comment.css';

function CommentSection(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For the first loading state
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/${props.postId}/comments`, {
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
    } finally {
      setLoading(false);
      setInitialLoading(false); // Disable the initial loading state after first load
    }
  }, [loading, page, props.postId]);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchComments();
    }
  };

    // Function to calculate the time since the notification
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
      } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
      }
    };


    
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
          p: 4,
          borderRadius: "16px",
          maxHeight: "95vh",
          overflowY: "auto",
          width: "80%",
          backgroundColor: "#1E1E1E",
          color: "white",
          padding: "0 60px",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            props.closeComments();
          }}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
          }}
        >
          <CloseIcon className="fs-2" />
        </IconButton>

        <h2 className='text-center p-0 text-warning fw-bold mt-4'>{props.postTitle}<span className='text-light'> Comments</span></h2>
        <div className='space' style={{ marginTop: '35px' }}></div>
        <div className='d-flex flex-column gap-4'>
          {comments.map((comment,index) => (
            <Comment
              key={comment.id - index*comment.id}
              id={comment.id}
              content={comment.content}
              likeCount={comment.like_count}
              dislikeCount={comment.dislike_count}
              firstname={comment.firstname}
              lastname={comment.lastname}
              profilePic={comment.profile_pic}
              time={timeSince(comment.commented_at)}
            />
          ))}

          {loading && !initialLoading && (
            <div className="d-flex justify-content-center my-3">
              <CircularProgress color="primary" />
            </div>
          )}

          {!hasMore && !loading && (
            <div className="d-flex justify-content-center my-3">
              <p>No comments to load</p>
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <div className="d-flex justify-content-center my-3">
            <IconButton onClick={handleLoadMore} aria-label="Load More">
              <ExpandMoreIcon className='text-primary' style={{ fontSize: '62px' }} />
            </IconButton>
          </div>
        )}
      </Box>
    </div>
  );
}

export default CommentSection;
