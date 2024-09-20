import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Post from '../parts/Post';
import Spinner from '../tools/Spinner';
import { IconButton } from '@mui/material';
import './styles/saves.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AppsIcon from '@mui/icons-material/Apps';
import CustomTooltip from '../tools/CustomTooltip';

function SavedPosts({ setShowChoice }) {
  const userId = 1;
  const limit=10;
  const savedPostsRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showOptions, setShowOptions]=useState(false)
  const [option, setOption]=useState('none')

  // Function to load saved posts
  const loadSavedPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/${userId}/saved-posts`, {
        params: { limit, page },
      });
      if(res.data.length < limit) setHasMore(false)
      setSavedPosts(prevPosts => [...prevPosts, ...res.data]);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  };


  const toggleOptions=()=>{
    setShowOptions(prev=>!prev)
  }

  // Fetch initial posts on mount and when page changes
  useEffect(() => {
    if(hasMore )  {loadSavedPosts();}
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = savedPostsRef.current.scrollTop;
      const scrollHeight = savedPostsRef.current.scrollHeight;
      const clientHeight = savedPostsRef.current.clientHeight;
      const scrollDifference = Math.abs(scrollTop - lastScrollTop.current);

      // Show/hide the choice based on scroll direction
      if (scrollDifference >= scrollThreshold) {
        setShowChoice(scrollTop < lastScrollTop.current);
        lastScrollTop.current = scrollTop;
      }

      // Load more posts when user scrolls to the bottom
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
  }, [loading, setShowChoice]);

  return (
    <div
      className="saved-posts d-flex flex-column gap-4 pt-3 position-relative"
      ref={savedPostsRef}
    >
      <CustomTooltip title="Options" placement="right">
        <IconButton
          variant="contained"
          onClick={toggleOptions}
          aria-label="Toggle notifications"
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning "
          style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
        >
          {showOptions && (
            <div className="options-container bg-transparent position-absolute bottom-100 my-4 d-flex flex-column gap-2">
              <IconButton
                className="text-dark bg-warning"
                variant="contained"
                onClick={() => {}}
              >
                <TuneIcon fontSize="large" className="text-dark" />
              </IconButton>

              <IconButton
                className="text-dark bg-warning"
                variant="contained"
                onClick={() => {}}
              >
                <AppsIcon fontSize="large" className="text-dark" />
              </IconButton>
            </div>
          )}
          <MoreHorizIcon fontSize="large" className="text-dark" />
        </IconButton>
      </CustomTooltip>

      {initialLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
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
              posterId={post.posterId}
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
