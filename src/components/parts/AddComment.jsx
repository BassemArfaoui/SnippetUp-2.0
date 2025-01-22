import React, { useEffect, useState, useRef } from 'react';
import './styles/AddComment.css';
import CloseIcon from '@mui/icons-material/Close';
import { IoSend } from "react-icons/io5";
import { successNotify } from '../tools/CustomToaster';
import SpinnerSpan from '../tools/SpinnerSpan';

function AddComment(props) {
  const [commentContent, setCommentContent] = useState('');
  const [placeholder, setPlaceholder] = useState('Add a comment');
  const textareaRef = useRef(null);
  const [commentLoading , setCommentLoading] = useState(false)

  useEffect(() => {
    if (props.reply) {
      setCommentContent(prev =>`[@${props.commentToReply.commentorName}]  `+prev);
      setPlaceholder(`Reply to ${props.commentToReply.commentorName}`);
      textareaRef.current.focus();
    }
  }, [props.commentToReply]);

  const commentChanged = (event) => {
    setCommentContent(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      submitComment(event);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      if (!props.reply) {
        setCommentLoading(true);
        await props.addComment(commentContent, false, null);
        setCommentLoading(false);
        props.scrollToTop();
      } else {
        setCommentLoading(true);
        await props.addComment(commentContent, true, props.commentToReply.commentId);
        setCommentLoading(false);
        setPlaceholder('Add a comment');
        props.setIsReply(false);
      }
      setCommentContent('');
      successNotify('Comment Uploaded Successfully');
      props.refreshComments();
    }
  };

  const cancelReply = () => {
    setCommentContent('');
    setPlaceholder('Add a comment');
      props.setIsReply(false);
  };

  return (
    <form method='POST' onSubmit={submitComment} className='add-cmnt-container w-100 h-100 d-flex justify-content-center align-items-center gap-3'>
      <div className="textarea-wrapper position-relative w-100 d-flex align-items-center justify-content-center">
        <textarea
          value={commentContent}
          onChange={commentChanged}
          onKeyDown={handleKeyDown}
          className='comment-textarea w-100 rounded-3 text-light fw-bold ps-2 pe-4'
          placeholder={placeholder}
          autoFocus
          autoComplete='off'
          autoCorrect='off'
          ref={textareaRef}
        ></textarea>


        {props.reply && <button 
          type="button" 
          className="clear-button position-absolute"
          onClick={cancelReply}
        >
          <CloseIcon/>
        </button>}

      </div>

      <span>
        <button type='submit' className='submit-cmnt bg-warning rounded-circle border-0 fs-4' disabled={commentLoading}>
          {!commentLoading ? <IoSend className='ms-1' /> : <SpinnerSpan color='text-dark'/>}
        </button>
      </span>

    </form>
  );
}

export default AddComment;
