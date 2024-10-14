import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Snippet from './Snippet';
import '../styles/saves.css';
import SpinnerSpan from '../../tools/SpinnerSpan';
import Spinner from '../../tools/Spinner';
import { notify, successNotify } from '../../tools/CustomToaster';
import LoadingSpinner from '../../tools/LoadingSpinner'; // Importing LoadingSpinner
import CustomTooltip from '../../tools/CustomTooltip';
import { Modal, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';






function SavedLocal({ setShowChoice }) {
  const userId = 1;
  const savedLocalRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addData, setAddData] = useState({
    title: '',
    content :'',
    language: ''
  });


  const openAddModel = () =>
  {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () =>
  {
    setIsAddModalOpen(false)
  }


  const handleAddSubmit =async () =>
  {
    if(addData.title.trim() && addData.content.trim() && addData.language.trim())
    {
      closeAddModal();
      try
      {
      await addSnippet.mutateAsync({newSnippet:addData})
      }
      catch(err)
      {
        console.error(err)
      }
    }else{
      notify('All fields are required')
    }
  }


  const handleAddChange=(e)=>
  {
    const {name,value}=e.target;
    setAddData(prevData=>({
      ...prevData,
      [name]:value
    }))
  }

  // Fetch snippets using React Query
  const fetchSnippets = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `http://localhost:4000/${userId}/snippets`,
      {
        params: {
          page: pageParam,
          limit: 10,
        },
      }
    );
    return response.data;
  };

  // Delete mutation
  const deleteSnippet = useMutation({
    mutationFn: async (id) => {
      setDeletingId(id); // Track the ID of the snippet being deleted
      await axios.delete(`http://localhost:4000/${userId}/delete/snippet/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["snippets"]);
      setDeletingId(null); // Reset deleting state after success
      successNotify("Snippet deleted successfully");
    },
    onError: () => {
      setDeletingId(null); // Reset deleting state after error
      notify(`Failed to delete snippet`);
    },
  });

  // Edit mutation
  const editSnippet = useMutation({
    mutationFn: async ({ id, updatedSnippet }) => {
      setEditingId(id); // Track the ID of the snippet being edited
      await axios.put(`http://localhost:4000/${userId}/edit/snippet/${id}`, updatedSnippet);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["snippets"]);
      setEditingId(null); 
      successNotify("Snippet updated successfully");
    },
    onError: () => {
      setEditingId(null);
      notify(`Failed to update snippet`);
    },
  });

    //add mutation
    const addSnippet = useMutation({
      mutationFn: async ({newSnippet }) => {
        setIsAdding(true);
        await axios.post(`http://localhost:4000/${userId}/add/snippet`, newSnippet);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(["snippets"]);
        setIsAdding(false); 
        setAddData({
          title: '',
          content :'',
          language: ''
        })
        successNotify("Snippet Added successfully");
      },
      onError: () => {
        setIsAdding(false); 
        notify(`Failed to Add snippet`);
      },
    });


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippets,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isError && error) {
      notify(`Error loading Snippets`);
    }
  }, [isError, error]);

  // Handle scrolling to trigger loading more snippets
  useEffect(() => {
    const handleScroll = () => {
      if (!savedLocalRef.current) return; // Check if ref is set
      const scrollTop = savedLocalRef.current.scrollTop;
      const scrollDifference = Math.abs(scrollTop - lastScrollTop.current);

      if (scrollDifference >= scrollThreshold) {
        if (scrollTop > lastScrollTop.current) {
          setShowChoice(false);
        } else {
          setShowChoice(true);
        }
        lastScrollTop.current = scrollTop;
      }

      // Load more snippets when scrolled to bottom
      if (
        savedLocalRef.current.scrollHeight - scrollTop <=
          savedLocalRef.current.clientHeight + 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const savedLocalElement = savedLocalRef.current;
    if (savedLocalElement) {
      savedLocalElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (savedLocalElement) {
        savedLocalElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setShowChoice, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div style={{ height: '85vh' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{ height: '85vh' }}
        className="fw-bolder text-danger fs-2 d-flex justify-content-center align-items-center"
      >
        Couldn't Load Snippets 😿 !
      </div>
    );
  }

  const hasSnippets = data?.pages?.some((page) => page.snippets.length > 0);

  return (
    <div className="local-saves d-flex flex-column gap-3" ref={savedLocalRef}>
      {!hasSnippets ? (
        <div className="text-center my-3 MT-5  fw-bold text-secondary">
          <span className='mt-5 d-block'> No Snippets ,<br/> Your Snippets will appear here.</span>
        </div>
      ) : (
        <>
          {data.pages.map((page) =>
            page.snippets.map((snippet) => (
              <div key={snippet.id}>
                <Snippet
                  id={snippet.id}
                  title={snippet.title}
                  content={snippet.content}
                  language={snippet.language}
                  createdAt={snippet.created_at}
                  modifiedAt={snippet.modified_at}
                  isPosted={snippet.is_posted}
                  deleteSnippet={deleteSnippet.mutate}
                  editSnippet={editSnippet.mutate}
                />
                {/* Show spinner next to the snippet being deleted or edited */}
                {deletingId === snippet.id && <LoadingSpinner bg="bg-primary" />}
                {editingId === snippet.id && <LoadingSpinner bg="bg-primary" />}
              </div>
            ))
          )}

          {isFetchingNextPage && (
            <div className="d-flex justify-content-center my-3 align-items-center">
              <SpinnerSpan />
            </div>
          )}

          {!hasNextPage && hasSnippets && (
            <div className="text-center my-3 small fw-bold text-secondary">
              No more snippets available.
            </div>
          )}
        </>
      )}

      {isAdding && <LoadingSpinner bg="bg-primary" />}




      {/* add btn */}
      <CustomTooltip title="Add Snippet" placement="right">
        <IconButton id='add-snippet'
          onClick={openAddModel}
          aria-label="Scroll to End"
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
          style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }}
        >
          <AddIcon fontSize="large" className="text-dark" />
        </IconButton>
      </CustomTooltip>



      {/* add  modal */}
      <Modal
        open={isAddModalOpen}
        onClose={closeAddModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px',
            maxHeight: '90vh',
            overflowY: 'auto',
            width: '90%',
            backgroundColor: '#1E1E1E',
            color: 'white',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeAddModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>

          <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">Add a Snippet</h2>
          <div className='filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4'>
                <form action='' method='POST' className='w-100'>
                  <div className='d-flex flex-column gap-3 '>
                    <div className='d-flex flex-column flex-md-row gap-3'>
                      <input
                        className='filter-input form-control bg-transparent'
                        placeholder='Title'
                        name='title'
                        value={addData.title}
                        onChange={handleAddChange}
                        spellCheck='false'
                        autoComplete='off'
                      />
                      <input
                        className='filter-input form-control bg-transparent'
                        placeholder='Language'
                        name='language'
                        value={addData.language}
                        spellCheck='false'
                        onChange={handleAddChange}
                      />
                    </div>
                    <textarea
                      className='centered-placeholder filter-input form-control bg-transparent'
                      placeholder='Content'
                      name='content'
                      onChange={handleAddChange}
                      value={addData.content}
                      style={{height:'250px'}}
                      autoComplete='off'
                      spellCheck='false'
                    ></textarea>
                  </div>
                </form>
                <div className='d-flex justify-content-center mt-5'>
                  <CustomTooltip title='Add Snippet' placement='top'>
                    <IconButton
                      className='mx-4 mt-0 bg-warning'
                      style={{ backgroundColor: '#f8f9fa' }}
                      onClick={handleAddSubmit}
                        
                    >
                      <DoneRoundedIcon fontSize='large' className='text-dark fw-bolder' />
                    </IconButton>
                    
                  </CustomTooltip>
                </div>
              </div>
        </Box>
      </Modal>
    </div>
  );
}

export default SavedLocal;
