import React, { useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'; 
import './styles/Comment.css'
import axios from 'axios';
import Comment from './Comment';



function CommentSection(props) {


  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "16px",
          maxHeight: "95vh",
          overflowY: "auto",
          width: "80%",
          backgroundColor: "#1E1E1E",
          color: "white",
          padding: "0 60px",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            props.closeComments();
          }}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
          }}
        >
          <CloseIcon className="fs-2" />
        </IconButton>

        <h2 className='text-center p-0  text-warning fw-bold mt-4'>Post Title's Comments</h2>
        <div className='space' style={{marginTop:'35px'}}></div>
        <div className='d-flex flex-column gap-4'>
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
        </div>
      </Box>
    </div>
  );
}

export default CommentSection