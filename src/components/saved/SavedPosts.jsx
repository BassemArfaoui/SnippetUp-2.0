import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Post from '../parts/Post';
import Spinner from '../tools/Spinner';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import './styles/saves.css';
import './styles/filter.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TuneIcon from '@mui/icons-material/Tune';
import AppsIcon from '@mui/icons-material/Apps';
import CustomTooltip from '../tools/CustomTooltip';
import { notify } from '../tools/CustomToaster';
import SpinnerSpan from '../tools/SpinnerSpan';

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
  const [filterLoading,setFilterloading]=useState(false);

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

  };

  const handleFilterClose = () => {
    setFilterLanguage('');
    setFilterTitle('');
    setFilterContent('');
    setFilterModalOpen(false);
  };

  const applyFilters = () => {
   setFilterloading(true);
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
                onClick={handleFilterOpen} 
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
            backgroundColor: '#333',
            width: '60%',
            height: '60vh',
            paddingX: '70px',
            paddingY: '20px',
            overflowY: 'auto',
            borderRadius: '20px',
            color: '#fff', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', 
            position: 'relative'
          }}
        >
  

            <IconButton
              aria-label="close"
              onClick={handleFilterClose}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white'
              }}
            >
              <CloseIcon className='fs-2'/>
            </IconButton>

        <h2 id="filter-modal-title" className='text-center mb-4 mt-2 fw-bold text-warning'>Filter Saved Posts</h2>

        <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3">
          <form action="" method='POST'>
            <div className='d-flex flex-column gap-3'>
                <div className='d-flex flex-column flex-md-row gap-3'>
                  <input
                    className='filter-input form-control'
                    placeholder='Title'
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                  <input
                    value={filterLanguage}
                    className='filter-input form-control'
                    placeholder='Language'
                    onChange={(e) => setFilterLanguage(e.target.value)}
                  />
                </div>
              <textarea
                className='filter-input form-control'
                value={filterContent}
                placeholder='Content'
                onChange={(e) => setFilterContent(e.target.value)}
              ></textarea>
            </div>
          </form>


          <div className="d-flex justify-content-center mt-5">
            <CustomTooltip title='Apply Filters' placement='top'>
              <IconButton
                aria-label="Scroll to End"
                className="mx-4 mt-0 bg-warning" 
                style={{ backgroundColor: '#f8f9fa' }} >

               {!filterLoading ? 
               <DoneRoundedIcon fontSize="large" className="text-dark fw-bolder" onClick={applyFilters}/> : 
               <SpinnerSpan/>
               }

              </IconButton>
            </CustomTooltip>
          </div>
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
