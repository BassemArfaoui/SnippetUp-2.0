import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CustomTooltip from '../tools/CustomTooltip';
import './styles/collections.css';
import { notify } from '../tools/CustomToaster';
import Spinner from '../tools/Spinner';
import CloseIcon from '@mui/icons-material/Close';

function SavedPostsCollections() {
  const userId = 1;

  // Function to fetch collections using axios
  const fetchCollections = async () => {
    const response = await axios.get(`http://localhost:4000/${userId}/collections`);
    return response.data; // assuming the collections are returned as an array
  };

  // Use react-query to fetch collections without caching
  const { data: collections, isLoading, isError, isFetching } = useQuery({
    queryKey: ['collections', userId],
    queryFn: fetchCollections,
    staleTime: 0, // No stale time, always fetch new data
    cacheTime: 0,  // No cache, do not store data
    refetchOnWindowFocus: true, // Refetch when window focus returns
    refetchOnMount: true, // Refetch when the component mounts
    refetchOnReconnect: true, // Refetch when reconnecting to the internet
  });

  // Display an error notification when there is an error
  if (isError) {
    return (
      <div className='h-100 w-100 d-flex justify-content-center align-items-center text-danger fw-bold mt-5 fs-4' style={{ height: '70vh' }}>
        <span className='mt-5'>Couldn't load the collections</span>
      </div>
    );
  }

  // Display loading spinner only on the first load (no cached data yet)
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='collections-page'>
      {/* Spinner at the top if refetching, while still showing the old data */}
      {isFetching && (
        <div className="d-flex justify-content-center align-items-center my-2">
          <Spinner size="small" />
        </div>
      )}

      <h2 className="text-center my-5 fw-bolder fs-1">Collections :</h2>

      {/* Display collections */}
      <div className="collections-list d-flex justify-content-center gap-4 flex-wrap px-5">
        {collections && collections.length > 0 ? (
          collections.map((collection, index) => (
            <Link to={`/saved/posts/collection/${collection}`}>
              <h3 key={index} className="collection-item btn fw-bold border-2 border-primary bg-primary fs-5 px-4 py-2">
                {collection || 'Untitled Collection'}
              </h3>
            </Link>
          ))
        ) : (
          <div>No collections found</div>
        )}
      </div>

      <div className='cancel-filter-container'>
        <Link to='/saved' className='d-flex justify-content-center align-items-center'>
          <CustomTooltip title='Close Collections' placement='right'>
            <IconButton
              variant="contained"
              aria-label="Toggle notifications"
              className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
              style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
            >
              <CloseIcon fontSize="large" className="text-dark" />
            </IconButton>
          </CustomTooltip>
        </Link>
      </div>
    </div>
  );
}

export default SavedPostsCollections;
