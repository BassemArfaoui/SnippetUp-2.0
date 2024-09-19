import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; 
import CustomTooltip from '../tools/CustomTooltip';

function FeedSide() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); 
  const feedSideRef = useRef(null); 
  const userId = 1;
  const limit = 10; 

  const fetchPosts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/${userId}/posts`, {
        params: { limit }
      });
      const newPosts = response.data;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false); 
    }
  }, [loading, userId, limit]);

  useEffect(() => {
    fetchPosts(); 
  }, []);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = feedSideRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      fetchPosts();
    }
  }, [fetchPosts, loading]);

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

  const scroll = () => {
    if (feedSideRef.current) {
      const { scrollTop, clientHeight } = feedSideRef.current;
      feedSideRef.current.scrollTop = scrollTop + clientHeight / 2;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        scroll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="col-lg-12 p-0">
      {initialLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div 
          className="feed-side d-flex flex-column gap-2" 
          ref={feedSideRef} 
        >
          <div className="pt-3"></div>
          {posts.map((post, index) => (
            <Post
              key={`${post.id}-${index}`}     
              id={post.id}
              title={post.title}
              snippet={post.snippet}
              description={post.description}
              posterId={post.poster_id}
              language={post.language}
              likeCount={post.like_count}
              dislikeCount={post.dislike_count}
              commentCount={post.comment_count}
              shareCount={post.share_count}
              isLiked={post.isLiked}
              isDisliked={post.isDisliked}
              isSaved={post.isSaved}
              isInterested={post.isInterested}
              githubLink={post.github_link}
              firstname={post.poster_firstname}
              lastname={post.poster_lastname}
              username={post.poster_username}
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
      )}
      <CustomTooltip title='Scroll Down' placement='right'>
        <IconButton
          onClick={scroll} 
          aria-label="Scroll to End"
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning" 
          style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }} >
          <ArrowDownwardIcon fontSize="large" className="text-dark" />
        </IconButton>
      </CustomTooltip>
         
    </div>
  );
}

export default FeedSide;
