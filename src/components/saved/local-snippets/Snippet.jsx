import React from 'react'
import profile_pic from '../../../imgs/profile_pic.jpg';
import CustomTooltip from '../../tools/CustomTooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CodeHighlighter from '../../tools/CodeHighliter';

import { useState } from 'react';


function Snippet() {

 const [isInterested, setIsInterested] = useState(false);
  return (
    <div className="post rounded-4 p-4">

    {/* Snippet Title and Buttons */}
    <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
      <h3 className="snippet-title fw-bold text-center">some title</h3>

    </div>
    {/* Code Block */}
    <div className="border border-secondary rounded p-3" style={{ height: '200px', overflowY: 'auto' }}>
      <pre className="text-white " style={{fontSize:'22px'}}>
        <code>
          <CodeHighlighter codeSnippet={`const fetchData = async () => { 
     try { 
       let response = await fetch("api/data"); 
       let data = await response.json(); 
       console.log(data); 
     } 
     catch (error) { 
       console.error("Error fetching data:", error); 
     } 
   }`} />
        </code>
      </pre>
    </div>


    <div className='d-flex justify-content-between align-items-center mt-4'>
        <div className=" d-inline-flex align-items-center justify-content-between mb-3 px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">
            javascript
        </div>

        <div className="buttons justify-content-end d-flex gap-3 align-items-center">
        
        {/* Description Button */}
        <CustomTooltip title='Description' placement='top'>
          <button className="btn btn-outline-light post-btn" onClick={()=>{}}>
        <LightbulbIcon style={{ fontSize: '27px' }} />
          </button>
        </CustomTooltip>
        
        <CustomTooltip title='Description' placement='top'>
          <button className="btn btn-outline-light post-btn" onClick={()=>{}}>
        <LightbulbIcon style={{ fontSize: '27px' }} />
          </button>
        </CustomTooltip>
        
        <CustomTooltip title='Description' placement='top'>
          <button className="btn btn-outline-light post-btn" onClick={()=>{}}>
        <LightbulbIcon style={{ fontSize: '27px' }} />
          </button>
        </CustomTooltip>
        
        <CustomTooltip title='Description' placement='top'>
          <button className="btn btn-outline-light post-btn" onClick={()=>{}}>
        <LightbulbIcon style={{ fontSize: '27px' }} />
          </button>
        </CustomTooltip>
        {/* Save, Copy, and Fullscreen Buttons */}
        {/* {isSaved ? (
          <button
        className="btn btn-outline-primary post-btn"
        onClick={unsaveSnippet}
          >
        <BookmarkAddedIcon style={{ fontSize: '28px' }} />
          </button>
        ) : (
          <CustomTooltip title='Save Snippet' placement='top'>
        <button
          className="btn btn-outline-light post-btn"
          onClick={openCollectionModal}
        >
          <BookmarkAddIcon style={{ fontSize: '28px' }} />
        </button>
          </CustomTooltip>
        )} */}
        
        
        {/* {isCopied ? (
          <button className="btn btn-outline-primary post-btn">
        <DoneIcon />
          </button>
        ) : (
          <CustomTooltip title='Copy Snippet' placement='top'>
        <button className="btn btn-outline-light post-btn" onClick={copyCode}>
          <ContentCopyIcon />
        </button>
          </CustomTooltip>
        )} */}
        
        {/* 
        
        <CustomTooltip title='Full Screen' placement='top'>
          <button className="btn btn-outline-light post-btn" onClick={openFullScreen}>
        <FullscreenIcon style={{ fontSize: '34px' }} />
          </button>
        </CustomTooltip> */}
        </div>
    </div>



    {/* Fullscreen Modal */}
    {/* <Modal
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
        <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">{snippetTitle}</h2>
        <pre id="modal-description" style={{ whiteSpace: 'pre-wrap' }}>
          <code style={{fontSize:'25px'}}>
            <CodeHighlighter codeSnippet={snippetCode} />
          </code>
        </pre>
      </Box>
    </Modal> */}



    {/* Description Modal */}
    {/* <Modal
      open={isDescriptionOpen}
      onClose={closeDescription}
      aria-labelledby="description-modal-title"
      aria-describedby="description-modal-content"
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
          width: '50%',
          backgroundColor: '#1E1E1E',
          color: 'white',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={closeDescription}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'white'
          }}
        >
          <CloseIcon className='fs-2'/>
        </IconButton>
        <h3 id="description-modal-title" className="fw-bold mb-5 text-center text-warning">{snippetTitle}</h3>
        <div id="description-modal-content " className="fs-5 text-center mt-4" style={{ whiteSpace: 'pre-wrap' }}>
          {snippetDescription}
        </div>
      </Box>
    </Modal> */}







    







  </div>
  )
}

export default Snippet