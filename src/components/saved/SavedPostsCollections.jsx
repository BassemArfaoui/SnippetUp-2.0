import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CustomTooltip from '../tools/CustomTooltip';
import './styles/collections.css';
import { notify } from '../tools/CustomToaster';
import Spinner from '../tools/Spinner';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

function SavedPostsCollections() {
  const userId = 1;

  // Function to fetch collections using axios
  const fetchCollections = async () => {
    const response = await axios.get(`http://localhost:4000/${userId}/collections`);
    return response.data; // assuming the collections are returned as an array
  };

  // Use react-query to fetch collections
  const { data: collections, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['collections', userId],
    queryFn: fetchCollections,
    refetchOnWindowFocus: true,

  });

  // Optional useEffect for error notification
  useEffect(() => {
    if (isError) {
      notify("Error loading collections");
    }
  }, [isError]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '85vh' }}>
        <IconButton
          onClick={refetch}
          aria-label="Refresh"
          className="bg-primary"
          style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
        >
          <RefreshIcon style={{ fontSize: 50 }} className="text-dark" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className='collections-page'>
      {/* Spinner at the top if refetching, while still showing the old data */}
      {isFetching && (
        <div className="d-flex justify-content-center align-items-center my-2">
          <Spinner size="small" />
        </div>
      )}

     {collections && collections.length > 0 && <h2 className="text-center my-5 fw-bolder fs-2">Saved Posts Collections :</h2>}

      <div className="collections-list d-flex justify-content-center gap-3 m-0 flex-wrap px-3">
        {collections && collections.length > 0 ? (
          collections.map((collection, index) => (
            <div key={index + collection}>
              <Link to={`/saved/posts/collection/${collection}`}>
                <h3 className="collection-item fw-bold border-2 border-primary fs-5 px-4 py-2">
                  {collection || 'Untitled Collection'}
                </h3>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center fw-bold text-secondary small fs-4 my-5 d-flex align-items-center" style={{height:'50vh'}}>
            No collections yet
          </div>
        )}
      </div>

      <div className='cancel-filter-container'>
        <Link to='/saved' className='d-flex justify-content-center align-items-center'>
          <CustomTooltip title='Close Collections' placement='right'>
            <IconButton
              variant="contained"
              aria-label="Close collections"
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
