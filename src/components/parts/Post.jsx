import React, { useState } from 'react';
import profile_pic from '../../imgs/profile_pic.jpg';
import './styles/Post.css';
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
import { Modal, Box, IconButton } from '@mui/material'; // Added IconButton component
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import CustomTooltip from '../tools/CustomTooltip';
import { successNotify , notify } from '../tools/CustomToaster';
import CodeHighlighter from '../saved/CodeHighliter';

export default function Post(props) {
  //bool states
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isIntrested, setIsIntrested] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false); // state to handle modal



  //post states
  const [snippetCode,setSnippetCode]=useState(props.snippet)
  const [snippetTitle,setSnippetTitle]=useState(props.title)
  const [snippetPoster,setSnippetPoster]=useState('Bassem Arfaoui');

  //reactions counts
  const [react, setReact] = useState('none');
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [dislikeCount, setDislikeCount] = useState(props.dislikeCount);
  const [commentCount, setCommentCount] = useState(props.commentCount);
  const [shareCount, setShareCount] = useState(props.shareCount);
  const [language,setLanguage]=useState(props.language)

  //buttons functions
  const saveSnippet = () => {
    setIsSaved(true);
    successNotify('Snippet Saved');
  };

  const unsaveSnippet = () => {
    successNotify('Snippet is no longer Saved');
    setIsSaved(false);
  };

  const copyCode =async () => {
    try
    {
      await navigator.clipboard.writeText(snippetCode);
      setIsCopied(true);
      successNotify('Snippet Copied')
      setTimeout(() => {
        setIsCopied(false);
      }, 1600);
    }
    catch(err)
    {
      console.log(err);
      notify("Couldn't Copy");
    }

  };

  const uncopyCode = () => {
    setIsCopied(false);
  };

  const becomeIntrested = () => {
    setIsIntrested(true);
    successNotify(`You are now intrested in ${snippetPoster}'s Snippets`);
  };

  const becomeUnintrested = () => {
    setIsIntrested(false);
    successNotify(`No longer intrested in ${snippetPoster}'s Snippets`);
  };

  const likeSnippet = () => {
    if (react === 'dislike') {
      setDislikeCount((prev) => parseInt(prev) - 1);
    }
    setReact('like');
    setLikeCount((prev) => parseInt(prev) + 1);
  };

  const dislikeSnippet = () => {
    if (react === 'like') {
      setLikeCount((prev) => parseInt(prev) - 1);
    }
    setReact('dislike');
    setDislikeCount((prev) => parseInt(prev) + 1);
  };

  const unlikeSnippet = () => {
    setReact('none');
    setLikeCount((prev) => parseInt(prev) - 1);
  };

  const undislikeSnippet = () => {
    setReact('none');
    setDislikeCount((prev) => parseInt(prev) - 1);
  };

  // modal control functions
  const openModal = () => {
    setisFullScreen(true);
  };

  const closeModal = () => {
    setisFullScreen(false);
  };

  return (
    <div className="post rounded-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="avatar">
            <img
              src={profile_pic}
              alt="user picture"
              className="rounded-circle"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
          <div>
            <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
              <span className="p-0 m-0">{snippetPoster}</span>
              {!isIntrested ? (
                <span
                  className="text-light p-0 mb-1 ms-2 intrested-icon"
                  onClick={becomeIntrested}
                >
                <CustomTooltip title='Intrested' placement='top'>
                  <StarBorderIcon style={{ fontSize: '30px' }} />
                </CustomTooltip>
                </span>
              ) : (
                <span
                  className="text-primary p-0 mb-1 ms-2 intrested-icon"
                  onClick={becomeUnintrested}
                >
                  <StarIcon style={{ fontSize: '30px' }} />
                </span>
              )}
            </div>
            <div className="text-secondary fs-5">@arfBassem</div>
          </div>
        </div>
        <div className="px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">
          {language}
        </div>
      </div>
      <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
        <h3 className="snippet-title fw-bold text-center">{snippetTitle}</h3>
        <div className="buttons align-self-end d-flex gap-3 align-items-center">
          <div className="save-btn">
            {/* save button */}
            {isSaved ? (
              <button
                className="btn btn-outline-primary post-btn"
                onClick={unsaveSnippet}
              >
                <BookmarkAddedIcon className="" style={{ fontSize: '28px' }} />
              </button>
            ) : (
              <CustomTooltip title='Save Snippet' placement='top'>
              <button
                  className="btn btn-outline-light post-btn"
                  onClick={saveSnippet}
                >
                  <BookmarkAddIcon style={{ fontSize: '28px' }} />
                </button>
              </CustomTooltip>
            )}
          </div>
          {/* copy button */}
          {isCopied ? (
            <button className="btn btn-outline-primary post-btn" onClick={uncopyCode}>
              <DoneIcon />
            </button>
          ) : (
            <CustomTooltip title='Copy Snippet' placement='top'>
              <button className="btn btn-outline-light post-btn" onClick={copyCode}>
                  <ContentCopyIcon />
              </button>
            </CustomTooltip>
          )}
          {/* fullscreen button */}
          <CustomTooltip title='Full Screen' placement='top'>
            <button className="btn btn-outline-light post-btn" onClick={openModal}>
              <FullscreenIcon style={{ fontSize: '34px' }} />
            </button>
          </CustomTooltip>

        </div>
      </div>
      <div className="border border-secondary rounded p-3" style={{ height: '200px', overflowY: 'auto' }}>
        <pre className="text-white " style={{fontSize:'22px'}}>
          <code>
            <CodeHighlighter codeSnippet={snippetCode} /> 
          </code>
        </pre>

        
      </div>

      <Modal
        open={isFullScreen}
        onClose={closeModal}
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
            borderRadius: '8px',
            maxHeight: '90vh',
            overflowY: 'auto',
            width: '90%',
            backgroundColor: '#1E1E1E',
            color: 'white',
          }}
        >
          {/* Close icon in the top-right corner */}
          <IconButton
            aria-label="close"
            onClick={closeModal}
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
      </Modal>

      <div className="d-flex justify-content-start align-items-center gap-3 mt-2 pt-3">
        <div className="text-center">
          {react === 'like' ? (
            <button className="btn btn-primary p-2 px-3 fw-bolder fs-5 like-btn" onClick={unlikeSnippet}>
              <ThumbUpIcon />
            </button>
          ) : (
            <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn" onClick={likeSnippet}>
              <ThumbUpIcon />
            </button>
          )}
          <div className="text-light mt-1">{likeCount}</div>
        </div>
        <div className="text-center">
          {react === 'dislike' ? (
            <button className="btn btn-danger p-2 px-3 fw-bolder fs-5 like-btn" onClick={undislikeSnippet}>
              <ThumbDownIcon />
            </button>
          ) : (
            <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn" onClick={dislikeSnippet}>
              <ThumbDownIcon />
            </button>
          )}
          <div className="text-light mt-1">{dislikeCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn">
            <CommentIcon />
          </button>
          <div className="text-light mt-1">{commentCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn">
            <ShareIcon />
          </button>
          <div className="text-light mt-1">{shareCount}</div>
        </div>
      </div>
    </div>
  );
}
