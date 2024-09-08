import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Material-UI Icon

function FeedSide() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial loading
  const feedSideRef = useRef(null); // Ref for the scrolling container
  const limit = 10; // Number of posts to load per batch

  const fetchPosts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
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
      setInitialLoading(false); // Set to false after the first load
    }
  }, [loading]);

  useEffect(() => {
    fetchPosts(); // Initial fetch on component mount
  }, [fetchPosts]);

  // Handle scroll event for the .feed-side div
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = feedSideRef.current;

    // Check if the user is near the bottom of the container and not currently loading
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

  // Function to scroll to the bottom of the feed-side container
  const scroll = () => {
    if (feedSideRef.current) {
      const { scrollTop, clientHeight } = feedSideRef.current;
      // Scroll down by a fraction of the client height, e.g., half the visible height
      feedSideRef.current.scrollTop = scrollTop + clientHeight / 2;
    }
  };

  return (
    <div className="col-lg-12 p-0">
      {initialLoading ? (
        // Centered spinner for the initial loading
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div 
          className="feed-side d-flex flex-column gap-2" 
          ref={feedSideRef} // Attach the ref to the .feed-side div for scrolling
        >
          <div className="pt-3"></div>
          {posts.map((post) => (
            <Post
              key={post.id} // Use a unique key for each post (assuming `id` is unique)
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
              {/* Bootstrap Spinner */}
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scroll to End Button using Material-UI IconButton */}
      <IconButton
        onClick={scroll} // Call scrollToEnd function when clicked
        aria-label="Scroll to End"
        className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning" // Bootstrap classes for position
        style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }} // Custom styles
      >
        <ArrowDownwardIcon fontSize="large" className="text-dark" /> {/* Material-UI Icon */}
      </IconButton>
    </div>
  );
}

export default FeedSide;
