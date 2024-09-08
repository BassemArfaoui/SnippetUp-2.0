import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Material-UI Icon

function FeedSide() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const feedSideRef = useRef(null); 
  const limit = 10; 

  const fetchPosts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {

      // Fetch random posts
      const response = await axios.get('http://localhost:4000/posts', {
        params: { limit }
      });
      const newPosts = response.data;

      // Add the new random posts to the existing list
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);


  //first mount
  useEffect(() => {
    fetchPosts(); 
  }, [fetchPosts]);

  // Handle scroll event
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = feedSideRef.current;

    // Check if the user is near the bottom + not currently loading
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      fetchPosts();
    }
  };

  useEffect(() => {
    const feedSideDiv = feedSideRef.current;
    if (feedSideDiv) {
      feedSideDiv.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (feedSideDiv) {
        feedSideDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Function to scroll down
  const scrollToEnd = () => {
    if (feedSideRef.current) {
      feedSideRef.current.scrollTop = feedSideRef.current.scrollHeight;
    }
  };

  return (
    <div className="col-lg-12 p-0">
      <div 
        className="feed-side d-flex flex-column gap-2" 
        ref={feedSideRef} 
      >
        <div className="pt-3"></div>
        {posts.map((post) => (
          <Post
            key={post.id} 
            title={post.title}
            snippet={post.snippet}
            description={post.description}
            posterId={post.poster_id}
            language={post.language}
            likeCount={post.like_count}
            dislikeCount={post.dislike_count}
            commentCount={post.comment_count}
            shareCount={post.share_count}
          />
        ))}
        {loading && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      <IconButton
        onClick={scrollToEnd} 
        aria-label="Scroll to End"
        className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning" 
        style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }} 
      >
        <ArrowDownwardIcon fontSize="large" className="text-dark" /> 
      </IconButton>
    </div>
  );
}

export default FeedSide;
