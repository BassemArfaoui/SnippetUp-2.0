import React, { useState } from 'react';
import '../css/SavedPage.css';
import SavedChoice from '../components/saved/SavedChoice';
import SavedPosts from '../components/saved/saved-posts/SavedPosts';
import SavedLocal from '../components/saved/local-snippets/SavedLocal';
import PostsSearch from '../components/saved/saved-posts/PostsSearch';
import LocalSearch from '../components/saved/local-snippets/LocalSearch';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, IconButton } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CustomTooltip from '../components/tools/CustomTooltip';
import SpinnerSpan from '../components/tools/SpinnerSpan';
import SavedPostsFilter from '../components/saved/saved-posts/SavedPostsFilter';
import LocalPostsFilter from '../components/saved/local-snippets/LocalPostsFilter';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { notify } from '../components/tools/CustomToaster';
import LoadingSpinner from '../components/tools/LoadingSpinner';

function SavedPage() {
  const userId = 1;
  const [showChoice, setShowChoice] = useState(true);
  const [choice, setChoice] = useState('posts');
  const [isSearching, setIsSearching] = useState('none');
  const [isFiltering, setIsFiltering] = useState('none');
  const [postsSearch, setPostsSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');



  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterContent, setFilterContent] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [hasMoreFilteredPosts, setHasMoreFilteredPosts] = useState(true);
  const [filterPage, setFilterPage] = useState(1);




  const handleFilterClose = () => {
    setFilterLanguage('');
    setFilterTitle('');
    setFilterContent('');
    setFilterModalOpen(false);
  };

  const handleFilterOpen = () => {
    setFilterModalOpen(true);
  };

  const applyFilters = async () => {
   if(!filterContent && !filterLanguage && !filterTitle)
   {
    notify('Please add at least one filter option');
   }
   else
   {
    setFilterLoading(true);
    setFilterModalOpen(false);
    setIsSearching('none');
    setFilterPage(1); 
    setFilteredPosts([]);

    try {
      const response = await axios.get(`http://localhost:4000/${userId}/saved-posts/filter`, {
        params: {
          title: filterTitle,
          language: filterLanguage,
          content: filterContent,
          page: 1, // start from page 1 when applying filters
          limit: 10, // adjust as needed
        },
      });

      const fetchedPosts = response.data;

      if (fetchedPosts.length < 10) {
        setHasMoreFilteredPosts(false);
      } else {
        setHasMoreFilteredPosts(true); 
      }

      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    } finally {
      setFilterLoading(false);
      setIsFiltering('posts');
    }
   }
  };


   

  const loadMoreFilteredPosts = async () => {
    // Increment the page number before making the next request
    setFilterLoading(true);
    const nextPage = filterPage + 1;
    setFilterPage(nextPage);

    try {
      const response = await axios.get(`http://localhost:4000/${userId}/saved-posts/filter`, {
        params: {
          title: filterTitle,
          language: filterLanguage,
          content: filterContent,
          page: nextPage,
          limit: 10,
        },
      });

      const fetchedPosts = response.data;

      if (fetchedPosts.length < 10) {
        setHasMoreFilteredPosts(false); // no more posts to load
      }

      // Append the newly fetched posts to the existing ones
      setFilteredPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      setFilterLoading(false);
    } catch (error) {
      console.error('Error loading more filtered posts:', error);
    }
  };

  const cancelFilter = () => {
    setIsFiltering('none');
    setFilterContent('')
    setFilterLanguage('');
    setFilterTitle('');
    setFilteredPosts([]);
  };





 

  return (
    <div className='saved-page'>
      <Helmet>
        <title>SnippetUp : Saved Items</title>
      </Helmet>
      <>
        {showChoice && (
          <SavedChoice
            choice={choice}
            setChoice={setChoice}
            setIsSearching={setIsSearching}
            localSearch={localSearch}
            postsSearch={postsSearch}
            setLocalSearch={setLocalSearch}
            setPostsSearch={setPostsSearch}
            isFiltering={isFiltering}
            setIsFiltering={setIsFiltering}
            cancelFilter={cancelFilter}
          />
        )}
        {isFiltering === 'none' ? (
          <>
            {isSearching === 'none' ? (
              <>
                {choice === 'posts' ? (
                  <SavedPosts
                    showChoice={showChoice}
                    setShowChoice={setShowChoice}
                    handleFilterOpen={handleFilterOpen}
                    handleFilterClose={handleFilterClose}
                  />
                ) : (
                  <SavedLocal setShowChoice={setShowChoice} />
                )}
              </>
            ) : (
              <>
                {isSearching === 'posts' ? (
                  <PostsSearch
                    postsSearch={postsSearch}
                    setShowChoice={setShowChoice}
                    setIsFiltering={setIsFiltering}
        
                  />
                ) : (
                  <LocalSearch localSearch={localSearch} setIsFiltering={setIsFiltering} />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {isFiltering === 'posts' ? (
              <SavedPostsFilter
                filterLanguage={filterLanguage}
                filterContent={filterContent}
                filterTitle={filterTitle}
                filteredPosts={filteredPosts}
                hasMoreFilteredPosts={hasMoreFilteredPosts}
                loadMoreFilteredPosts={loadMoreFilteredPosts}
                showChoice={showChoice}
                setShowChoice={setShowChoice}
                cancelFilter={cancelFilter}
                setFilteredPosts={setFilteredPosts}
                filterLoading={filterLoading}
        
              />
            ) : (
              <LocalPostsFilter />
            )}
          </>
        )}

        
        <Modal
          open={filterModalOpen}
          onClose={handleFilterClose}
          aria-labelledby='filter-modal-title'
          aria-describedby='filter-modal-description'
        >
          <Box
            sx={{
              backgroundColor: '#333',
              width: '60%',
              maxHeight: '95vh',
              paddingX: '70px',
              paddingY: '20px',
              overflowY: 'auto',
              borderRadius: '20px',
              color: '#fff',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'relative',
            }}
          >
            <IconButton
              aria-label='close'
              onClick={handleFilterClose}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white',
              }}
            >
              <CloseIcon className='fs-2' />
            </IconButton>
            <div className="d-flex flex-column gap-3 align-items-center">
              <h2 id='filter-modal-title' className='text-center mb-4 mt-2 fw-bold text-warning mb-3'>
                Filter Saved Posts
              </h2>
              <div className='filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3'>
                <form action='' method='POST'>
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
                <div className='d-flex justify-content-center mt-5'>
                  <CustomTooltip title='Apply Filters' placement='top'>
                    <IconButton
                      aria-label='Scroll to End'
                      className='mx-4 mt-0 bg-warning'
                      style={{ backgroundColor: '#f8f9fa' }}
                      onClick={applyFilters} // Trigger the apply filters
                    >
                       
                        <DoneRoundedIcon fontSize='large' className='text-dark fw-bolder' />
                    </IconButton>
                  </CustomTooltip>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

        {filterLoading && filterPage==1 && <LoadingSpinner />}
      </>
    </div>
  );
}

export default SavedPage;
