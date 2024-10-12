import React, { useState, useEffect, useRef } from 'react';
import CustomTooltip from '../../tools/CustomTooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CodeHighlighter from '../../tools/CodeHighliter';
import { notify, successNotify } from '../../tools/CustomToaster';
import SpinnerSpan from '../../tools/SpinnerSpan';

function Snippet(props) {
  const [editData,setEditData]=useState({
    title:props.title,
    content:props.content,
    language:props.language
  })
  const [isCopied, setIsCopied] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);
  const [isEditModalOpen,setIsEditModalOpen]=useState(false);
  const [isConfirmModalOpen,setIsConfirmModalOpen]=useState(false);
  const [showOptions, setShowOptions] = useState(false);


  // Ref for options holder
  const optionsRef = useRef(null);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
      setIsCopied(true);
      successNotify('Snippet Copied');
      setTimeout(() => {
        setIsCopied(false);
      }, 1600);
    } catch (err) {
      console.log(err);
      notify("Couldn't Copy");
    }
  };

  const openFullScreen = () => {
    setisFullScreen(true);
  };

  const closeFullScreen = () => {
    setisFullScreen(false);
  };

  const openOptions = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const openEditModal=()=>{
    closeOptions();
    setIsEditModalOpen(true);
  }

  const closeEditModal=()=>{
    setEditData(prevData=>({title:props.title,content:props.content,language:props.language}))
    setIsEditModalOpen(false);
  }

  const openConfirmModal = ()=>
  {
    closeOptions();
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = ()=>
  {
    setIsConfirmModalOpen(false)
  }

  const deleteSnippet = async()=>
  {
    closeConfirmModal();
    try
    {
      await props.deleteSnippet(props.id);
    }
    catch(err)
    {
    }
  }

  const editSnippet = async()=>
  { if(editData.title && editData.language && editData.content ){ 
      if(editData.title !== props.title || editData.language !== props.language || editData.content !== props.content)
      {
        setIsEditModalOpen(false);
        try{
          await props.editSnippet({ id: props.id, updatedSnippet: editData });
        } catch(err)
        {
          console.error(err.message);
          notify('Failed to edit snippet');
      }}
      else{
        closeEditModal();
      }
      }
    else 
      {
        notify('Please Fill all the Fields')
      }
  }


  const postSnippet = ()=>
  {
    setIsPosting(true)
    setTimeout(()=>{
      setIsPosting('success')
      successNotify('post uploaded successfully')
    },1000)
  }

  const handleEditChange=(e)=>
  {
    const {name,value}=e.target;
    setEditData(prevData=>({
      ...prevData,
      [name]:value
    }))
  }
  

  useEffect(()=>{
    if(props.isPosted)
    {
      setIsPosting('success')
    }
  },[props.isPosted])

  // Handle click outside of options div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up event listener on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);

  return (
    <div className="post rounded-4 p-4">
      {/* Snippet Title and Buttons */}
      <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
        <h3 className="snippet-title fw-bold text-center">{props.title}</h3>
      </div>

      {/* Code Block */}
      <div className="border border-secondary rounded p-3" style={{ height: '200px', overflowY: 'auto' }}>
        <pre className="text-white " style={{fontSize:'22px'}}>
          <code>
            <CodeHighlighter codeSnippet={props.content} />
          </code>
        </pre>
      </div>

      <div className='d-flex justify-content-between align-items-center mt-4'>
        <div className=" d-inline-flex align-items-center justify-content-between ms-2 px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">
          {props.language}
        </div>

        <div className="buttons justify-content-end d-flex gap-3 align-items-center me-2">
          {/* Action Buttons */}
          <div className='options-holder position-relative' ref={optionsRef}>
            <span className='m-0 p-0'>
              {(!showOptions ? 
                <button className="btn btn-outline-light post-btn" onClick={openOptions}>
                  <MoreVertIcon  style={{ fontSize: '27px' }} />
                </button> :
                <button className="btn btn-outline-primary post-btn" onClick={closeOptions}>
                  <MoreVertIcon  style={{ fontSize: '27px' }} />
                </button>)
              }
            </span>

            {showOptions && (
              <div className='d-inline-flex justify-content-center align-items-center gap-3 position-absolute bottom-100 mb-3 start-50 bg-primary p-2 rounded-3' style={{transform:'translateX(-50%)'}}>
                <CustomTooltip title='Snippet Infos' placement='top'>
                  <button className="btn btn-outline-light post-btn" onClick={() => {}}>
                    <InfoIcon  style={{ fontSize: '27px' }} />
                  </button>
                </CustomTooltip>

                <CustomTooltip title='Edit Snippet' placement='top'>
                  <button className="btn btn-outline-light post-btn" onClick={openEditModal}>
                    <EditIcon style={{ fontSize: '28px' }} />
                  </button>
                </CustomTooltip>

                <CustomTooltip title='Delete Snippet' placement='top'>
                  <button className="btn text-light post-btn" onClick={openConfirmModal} style={{backgroundColor:'#eb4334'}}>
                    <DeleteIcon style={{ fontSize: '27px' }} />
                  </button>
                </CustomTooltip>

              </div>
            )}
          </div>

          {isCopied ? (
            <button className="btn btn-outline-primary post-btn">
              <DoneIcon />
            </button>
          ) : (
            <CustomTooltip title='Copy Snippet' placement='top'>
              <button className="btn btn-outline-light post-btn" onClick={copyCode}>
                <ContentCopyIcon style={{ fontSize: '27px' }}/>
              </button>
            </CustomTooltip>
          )}

          <CustomTooltip title='Full Screen' placement='top'>
            <button className="btn btn-outline-light post-btn" onClick={openFullScreen}>
              <FullscreenIcon style={{ fontSize: '34px' }} />
            </button>
          </CustomTooltip>

          <CustomTooltip title={!isPosting ? 'post' : (isPosting===true ? 'posting ...':'posted')} placement='top'>
            {<span className="btn btn-outline-primary post-btn" >
              {!isPosting ? 
              <button className="btn btn-outline-primary post-btn" onClick={postSnippet}>
                <ArrowUpwardIcon style={{ fontSize: '37px' }} />
              </button> :
              <>
                {
                isPosting ===true ?
                 <button className="btn btn-outline-primary post-btn p-2">
                   <SpinnerSpan color='text-light' spanStyle={{width:'25px',height:'25px'}} /> 
                 </button> :
                 <button className="btn btn-outline-primary post-btn" onClick={()=> {notify('Snippet already posted')}}><DoneRoundedIcon />
                 </button>
                }
              </>
              }
            </span>}
          </CustomTooltip>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Modal
        open={isFullScreen}
        onClose={closeFullScreen}
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
            onClick={closeFullScreen}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>
          <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">{props.title}</h2>
          <pre id="modal-description" style={{ whiteSpace: 'pre-wrap' }}>
            <code style={{fontSize:'25px'}}>
              <CodeHighlighter codeSnippet={props.content} />
            </code>
          </pre>
        </Box>
      </Modal>

      {/* edit modal */}
      <Modal
        open={isEditModalOpen}
        onClose={closeEditModal}
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
            onClick={closeEditModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>

          <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">Edit Snippet</h2>
          <div className='filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4'>
                <form action='' method='POST' className='w-100'>
                  <div className='d-flex flex-column gap-3 '>
                    <div className='d-flex flex-column flex-md-row gap-3'>
                      <input
                        className='filter-input form-control bg-transparent'
                        placeholder='Title'
                        name='title'
                        value={editData.title}
                        onChange={handleEditChange}
                      />
                      <input
                        className='filter-input form-control bg-transparent'
                        placeholder='Language'
                        name='language'
                        value={editData.language}
                        onChange={handleEditChange}
                      />
                    </div>
                    <textarea
                      className='filter-input form-control bg-transparent'
                      placeholder='Content'
                      name='content'
                      onChange={handleEditChange}
                      value={editData.content}
                      style={{height:'250px'}}
                    ></textarea>
                  </div>
                </form>
                <div className='d-flex justify-content-center mt-5'>
                  <CustomTooltip title='Edit Snippet' placement='top'>
                    <IconButton
                      className='mx-4 mt-0 bg-warning'
                      style={{ backgroundColor: '#f8f9fa' }}
                      onClick={editSnippet}
                    >
                      <DoneRoundedIcon fontSize='large' className='text-dark fw-bolder' />
                    </IconButton>
                    
                  </CustomTooltip>
                </div>
              </div>
      
          
        </Box>
      </Modal>


      {/* delete confirmtion modal */}
      <Modal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
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
            maxHeight: '95vh',
            overflowY: 'auto',
            width: 'clamp(400px , 100% , 500px)',
            backgroundColor: '#1E1E1E',
            color: 'white',
            border:'2px solid darkgray'

          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeConfirmModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>

          <h3 id="modal-title" className="fw-bold mb-4 mt-4 text-center fs-4">Are you sure you want to Delete this Snippet ?</h3>

          <div className='d-flex gap-3  justify-content-center align-items-center mt-4'>
                  <button className='btn border-2 rounded-4  border-secondary text-secondary fs-5 lh-base small' onClick={closeConfirmModal}>Cancel
                  </button>

                  <button className=' btn border-2 border-danger text-danger fw-bold fs-5 lh-base rounded-4' onClick={deleteSnippet}>Delete
                  </button>
          </div>
          
        </Box>
      </Modal>


    </div>
  );
}

export default Snippet;
