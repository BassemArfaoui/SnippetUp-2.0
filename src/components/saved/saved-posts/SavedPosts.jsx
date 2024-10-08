import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Post from '../../parts/Post';
import Spinner from '../../tools/Spinner';
import { Modal, Box, IconButton } from '@mui/material';
import '../styles/saves.css';
import '../styles/filter.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TuneIcon from '@mui/icons-material/Tune';
import AppsIcon from '@mui/icons-material/Apps';
import { notify } from '../../tools/CustomToaster';
import { Link } from 'react-router-dom';

function SavedPosts(props) {
  const userId = 1;
  const limit = 10;
  const savedPostsRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showOptions, setShowOptions] = useState(false);


  const loadSavedPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/${userId}/saved-posts`, {
        params: { limit, page },
      });
      if (res.data.length < limit) setHasMore(false);
      setSavedPosts(prevPosts => [...prevPosts, ...res.data]);
    } catch (error) {
      notify('Error loading saved posts');
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };




  useEffect(() => {
    if(props.showChoice ===false)
    {
        props.setShowChoice(true)
    }
    
  }, []);

  

  useEffect(() => {
    if (hasMore) { loadSavedPosts(); }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = savedPostsRef.current.scrollTop;
      const scrollHeight = savedPostsRef.current.scrollHeight;
      const clientHeight = savedPostsRef.current.clientHeight;
      const scrollDifference = Math.abs(scrollTop - lastScrollTop.current);

      if (scrollDifference >= scrollThreshold) {
        props.setShowChoice(scrollTop < lastScrollTop.current);
        lastScrollTop.current = scrollTop;
      }

      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const savedPostsElement = savedPostsRef.current;
    if (savedPostsElement) {
      savedPostsElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (savedPostsElement) {
        savedPostsElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, props.setShowChoice]);

  return (
    <div
      className="saved-posts d-flex flex-column gap-4 pt-3 position-relative"
      ref={savedPostsRef}
    >


        <span
          variant="contained"
          onClick={toggleOptions}
          aria-label="Toggle notifications"
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning mui-icon-button"
          style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
        >
          {showOptions && (
            <div className="options-container bg-transparent position-absolute bottom-100 my-4 d-flex flex-column gap-2">
              <IconButton
                className="text-dark bg-warning"
                variant="contained"
                onClick={props.handleFilterOpen} 
              >
                <TuneIcon fontSize="large" className="text-dark" />
              </IconButton>

                <Link to='/saved/posts/collections' className='m-0 p-0 d-flex justify-content-center align-items-center'>
                  <IconButton
                    className="text-dark bg-warning"
                    variant="contained"
                  >
                      <AppsIcon fontSize="large" className="text-dark" />
                  </IconButton>
                </Link>
            </div>
          )}
          <MoreHorizIcon fontSize="large" className="text-dark" />
        </span>



   


      {initialLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner />
        </div>
      ) : (
        <>
          {savedPosts.map((post) => (
            <Post
              key={post.id}
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
              savedAt={post.saved_at}
              setSavedPosts={setSavedPosts}
            />
          ))}
          {loading && !initialLoading && (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!initialLoading && !loading && !hasMore && (
            <p className="text-center text-muted py-3 text-secondary small fw-bold">
              No more saved posts
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default SavedPosts;
