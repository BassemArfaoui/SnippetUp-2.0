import React, { useEffect , useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CustomTooltip from '../../tools/CustomTooltip';
import '../styles/collections.css';
import { notify } from '../../tools/CustomToaster';
import Spinner from '../../tools/Spinner';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import userContext from "../../contexts/userContext";


function SavedPostsCollections() {
  const {user}= useContext(userContext) ;
  const userId=user.id ;

  const fetchCollections = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userId}/collections`);
    return response.data; 
  };

  const { data: collections, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['collections', userId],
    queryFn: fetchCollections,
    refetchOnWindowFocus: true,

  });

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
      {isFetching && (
        <div className="d-flex justify-content-center align-items-center my-2">
          <Spinner size="small" />
        </div>
      )}

     {collections && collections.length > 0 && <h2 className="text-center mb-4 mt-3 fw-bolder" style={{fontSize:'28px'}}>Collections :</h2>}

      <div className="collections-list d-flex justify-content-center gap-3 m-0 flex-wrap mt-4 px-3">
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
