import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Post from '../parts/Post';
import Spinner from '../tools/Spinner';
import { IconButton, Modal, TextField, Button, Box } from '@mui/material';
import './styles/saves.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TuneIcon from '@mui/icons-material/Tune';
import AppsIcon from '@mui/icons-material/Apps';
import CustomTooltip from '../tools/CustomTooltip';
import { notify } from '../tools/CustomToaster';

function SavedPosts({ setShowChoice }) {
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
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterContent, setFilterContent] = useState('');

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

  const handleFilterOpen = () => {
    setFilterModalOpen(true);
    setFilterLanguage('');
    setFilterTitle('');
    setFilterContent('');
  };

  const handleFilterClose = () => {
    setFilterModalOpen(false);
  };

  const applyFilters = () => {
    const filteredPosts = savedPosts.filter(post => {
      return (
        (filterLanguage ? post.language.includes(filterLanguage) : true) &&
        (filterTitle ? post.title.includes(filterTitle) : true) &&
        (filterContent ? post.description.includes(filterContent) : true)
      );
    });
    setSavedPosts(filteredPosts);
    handleFilterClose();
  };

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
        setShowChoice(scrollTop < lastScrollTop.current);
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
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
          style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
        >
          {showOptions && (
            <div className="options-container bg-transparent position-absolute bottom-100 my-4 d-flex flex-column gap-2">
              <IconButton
                className="text-dark bg-warning"
                variant="contained"
                onClick={handleFilterOpen} // Open filter modal
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

      <Modal
        open={filterModalOpen}
        onClose={handleFilterClose}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box
          sx={{
            backgroundColor: '#333', // Dark background
            width: '80%',
            height: '90vh',
            paddingX: '50px',
            paddingY: '20px',
            overflowY: 'auto', // Allow scrolling if content exceeds height
            borderRadius: '15px', // Rounded corners
            color: '#fff', // Text color
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center vertically
            position: 'relative'
          }}
        >
          <h2 id="filter-modal-title" className='text-center mb-4 mt-2 fw-bold text-warning'>Filter Saved Posts</h2>
          <TextField
            label="Language"
            variant="outlined"
            fullWidth
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            margin="normal"
             sx={{ backgroundColor: '#fff' }}
          />
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            margin="normal"
            sx={{ backgroundColor: '#fff' }}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            value={filterContent}
            onChange={(e) => setFilterContent(e.target.value)}
            margin="normal"
            sx={{ backgroundColor: '#fff' }}
          />
          <div className="d-flex justify-content-end mt-3">
            <Button variant="contained" color="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="contained" color="secondary" onClick={handleFilterClose} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

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
