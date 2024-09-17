import React, {lazy, Suspense, useState , useEffect} from 'react';
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
import { successNotify, notify } from '../tools/CustomToaster';
import CodeHighlighter from '../saved/CodeHighliter';
import DescriptionIcon from '@mui/icons-material/Description';
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaLink } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from 'axios';
const CommentSection = lazy(() => import('./CommentSection'));



export default function Post(props) {
  const userId=1;
  // bool states
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isInterested, setisInterested] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false); 
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); 
  const [isShareModalOpen,setIsShareModalOpen]=useState(false)

  // post states
  const [snippetCode, setSnippetCode] = useState(props.snippet);
  const [snippetTitle, setSnippetTitle] = useState(props.title);
  const [snippetDescription, setSnippetDescription] = useState(props.description);

  // reactions counts
  const [react, setReact] = useState('none');
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [dislikeCount, setDislikeCount] = useState(props.dislikeCount);
  const [commentCount, setCommentCount] = useState(props.commentCount);
  const [shareCount, setShareCount] = useState(props.shareCount);
  const [language, setLanguage] = useState(props.language);



  
  useEffect(()=>{
    if(props.isLiked)
    {
      setReact('like');
    }
    else if(props.isDisliked)
    {
      setReact('dislike');
    }

    if(props.isSaved)
    {
      setIsSaved(true);
    }

    if(props.isInterested)
    {
      setisInterested(true);
    }
    },[props.isLiked,props.isDisliked,props.isSaved,props.isInterested])



  const addComment = async(content,is_reply,reply_to_id) =>
  {
    try
    {
      const data = {
                    userId:userId ,
                    postId:props.id ,
                    content:content ,
                    isReply:is_reply ,
                    replyToId:reply_to_id
                  }
      await axios.post(`http://localhost:4000/add/comment`,data)
    }
    catch(err)
    {
      console.log(err);
      notify("Couldn't Add the Comment")
    }
  }

  const saveSnippet = async () => {
    try {
      await axios.get(`http://localhost:4000/save/${userId}/${props.id}`);
      
      setIsSaved(true);
      successNotify('Snippet Saved');
    } catch (err) {
      notify("Couldn't save the Snippet");
    }
  };
  
  const unsaveSnippet = async () => {
    try {
      await axios.get(`http://localhost:4000/unsave/${userId}/${props.id}`);
      
      setIsSaved(false);
      successNotify('Snippet Unsaved');
    } catch (err) {
      notify("Couldn't unsave the Snippet");
    }
  };
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippetCode);
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
  
  const becomeInterested = async () => {
    try
    {
      await axios.get(`http://localhost:4000/interested/${userId}/${props.posterId}`);
      setisInterested(true);
      successNotify(`You are now Interested in ${props.firstname + ' '+props.lastname }'s Snippets`)
    }
    catch(err)
    {
      notify(`Couldn't add interest`)
    }
  };
  
  const becomeUninterested = async () => {
    try
    {
      await axios.get(`http://localhost:4000/uninterested/${userId}/${props.posterId}`);
      setisInterested(false);
      successNotify(`No Longer Interested in ${props.firstname + ' '+props.lastname }'s Snippets`)
    }
    catch(err)
    {
      notify(`Couldn't delete interest`)
    }
  };

  const likeSnippet =async () => {
    try
    {if (react === 'dislike') {
      await undislikeSnippet();
    }
    const result=await axios.get(`http://localhost:4000/like/${userId}/${props.id}`)
    setReact('like');
    setLikeCount((prev) => parseInt(prev) + 1);
   }catch(err)
   {
    notify("Couldn't like the Post");
   }
  };
  
  const unlikeSnippet = async () => {
    try
      {
      const result=await axios.get(`http://localhost:4000/unlike/${userId}/${props.id}`)
      setReact('none');
      setLikeCount((prev) => parseInt(prev) - 1);
      }catch(err)
      {
        notify("Couldn't unlike the Post");
      }
  };

  const dislikeSnippet = async () => {
    try {
      if (react === 'like') {
        await unlikeSnippet();
      }
      
      const result = await axios.get(`http://localhost:4000/dislike/${userId}/${props.id}`);
      
      setReact('dislike');
      setDislikeCount((prev) => parseInt(prev) + 1);
    } catch (err) {
      notify("Couldn't dislike the Post");
    }
  };
    
  const undislikeSnippet = async () => {
    try {
    
      await axios.get(`http://localhost:4000/undislike/${userId}/${props.id}`);
      
      setReact('none'); 
      setDislikeCount((prev) => parseInt(prev) - 1);
    } catch (err) {
      notify("Couldn't undislike the Post");
    }
  };
    
  const openFullScreen = () => {
    setisFullScreen(true);
  };

  const closeFullScreen = () => {
    setisFullScreen(false);
  };

  const openDescription = () => {
    setIsDescriptionOpen(true);
  };

  const closeDescription = () => {
    setIsDescriptionOpen(false);
  };

  const openComments = () => {
    setIsCommentsOpen(true);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
  };


  const openShareModal = () =>
  {
    setIsShareModalOpen(true)
  }

  const closeShareModal = () =>
  {
    setIsShareModalOpen(false)
  }

  const copyLink = (link) => {
    if (navigator.clipboard) {
         try 
         {
          navigator.clipboard.writeText(link)
          successNotify('Link copied to clipboard')
         }
        catch(err)
        {
          console.error("Couldn't copy the Link");
          console.log(err);
        }
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      successNotify('Link copied to clipboard');
    }
  }
  
  
  
  
  return (
    <div className="post rounded-4 p-4">
      {/* Post Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="avatar">
            <img
              src={profile_pic}
              alt="user"
              className="rounded-circle"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
          <div>
            <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
              <span className="p-0 m-0">{props.firstname +' '+props.lastname}</span>
              {!isInterested ? (
                <span
                  className="text-light p-0 mb-1 ms-2 intrested-icon"
                  onClick={becomeInterested}
                >
                  <CustomTooltip title='Intrested' placement='top'>
                    <StarBorderIcon style={{ fontSize: '30px' }} />
                  </CustomTooltip>
                </span>
              ) : (
                <span
                  className="text-primary p-0 mb-1 ms-2 intrested-icon"
                  onClick={becomeUninterested}
                >
                  <StarIcon style={{ fontSize: '30px' }} />
                </span>
              )}
            </div>
            <div className="text-secondary fs-5">@{props.username}</div>
          </div>
        </div>
        <div className="px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">
          {language}
        </div>
      </div>

      {/* Snippet Title and Buttons */}
      <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
        <h3 className="snippet-title fw-bold text-center">{snippetTitle}</h3>
        <div className="buttons align-self-end d-flex gap-3 align-items-center">
          {/* Description Button */}
          <CustomTooltip title='Description' placement='top'>
            <button className="btn btn-outline-light post-btn" onClick={openDescription}>
              <DescriptionIcon style={{ fontSize: '27px' }} />
            </button>
          </CustomTooltip>

          {/* Save, Copy, and Fullscreen Buttons */}
          {isSaved ? (
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
                onClick={saveSnippet}
              >
                <BookmarkAddIcon style={{ fontSize: '28px' }} />
              </button>
            </CustomTooltip>
          )}

          {isCopied ? (
            <button className="btn btn-outline-primary post-btn">
              <DoneIcon />
            </button>
          ) : (
            <CustomTooltip title='Copy Snippet' placement='top'>
              <button className="btn btn-outline-light post-btn" onClick={copyCode}>
                <ContentCopyIcon />
              </button>
            </CustomTooltip>
          )}


          <CustomTooltip title='Full Screen' placement='top'>
            <button className="btn btn-outline-light post-btn" onClick={openFullScreen}>
              <FullscreenIcon style={{ fontSize: '34px' }} />
            </button>
          </CustomTooltip>
        </div>
      </div>

      {/* Code Block */}
      <div className="border border-secondary rounded p-3" style={{ height: '200px', overflowY: 'auto' }}>
        <pre className="text-white " style={{fontSize:'22px'}}>
          <code>
            <CodeHighlighter codeSnippet={snippetCode} /> 
          </code>
        </pre>
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

          <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">{snippetTitle}</h2>
          <pre id="modal-description" style={{ whiteSpace: 'pre-wrap' }}>
            <code style={{fontSize:'25px'}}>
              <CodeHighlighter codeSnippet={snippetCode} />
            </code>
          </pre>
        </Box>
      </Modal>

      {/* Description Modal */}
      <Modal
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
      </Modal>


       {/* Share Modal */}
       <Modal
        open={isShareModalOpen}
        onClose={closeShareModal}
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
            border:'2px solid darkgray'

          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeShareModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>

          <h3 id="share-modal-title" className="fw-bold mb-5 text-center text-warning px-3">Share this post with :</h3>
          <div id="share-modal-content " className="fs-5  mt-4 d-flex justify-content-center gap-3 flex-wrap">
             <span className='share-option bg-primary' style={{fontSize:'38px'}}><FaFacebook/></span>
             <span className='share-option' style={{fontSize:'38px',backgroundColor:'#25D366'}}><IoLogoWhatsapp/></span>
             <span className='share-option instagram-option' style={{fontSize:'38px'}}><FaInstagram/></span>
             <span className='share-option x-option' style={{fontSize:'33px'}} > <FaXTwitter/></span>
             <span className='share-option bg-danger' style={{fontSize:'31px'}} onClick={()=>{copyLink(`http://localhost:3000/post/${props.id}`)}}><FaLink/></span>
        
          </div>
        </Box>
      </Modal>

      {/* Reactions */}
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
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn" onClick={openComments}>
            <CommentIcon />
          </button>
          <div className="text-light mt-1">{commentCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn" onClick={openShareModal}>
            <ShareIcon />
          </button>
          <div className="text-light mt-1">{shareCount}</div>
        </div>
      </div>
      
      {/* Comments Section */}
    <Suspense>
      <Modal
        open={isCommentsOpen}
        onClose={closeComments}
        aria-labelledby="description-modal-title"
        aria-describedby="description-modal-content"
      >
              <div>
                <CommentSection closeComments={closeComments} postId={props.id} postTitle={snippetTitle} addComment={addComment}/>
              </div>
      </Modal>
    </Suspense>


    </div>
  );
}
