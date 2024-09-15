import React, { useEffect, useState } from 'react';
import './styles/AddComment.css';
import { IoSend } from "react-icons/io5";
import { successNotify } from '../tools/CustomToaster';

function AddComment(props) {
  const [commentContent, setCommentContent] = useState('');

  useEffect(()=>{
    if(props.commentorName)
    {
      setCommentContent('@' + props.commentorName + '')
    }
  },[props.commentorName])

  const commentChanged = (event) => {
    setCommentContent(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault(); 
      submitComment(event); 

    }
  }

  const submitComment = async (e) => {
    e.preventDefault();
   if(commentContent)
   {
    await props.addComment(commentContent,false,null);
    setCommentContent('');
    successNotify('Comment Uploaded Successfully')
    props.refreshComments();
  }
  }

  return (
    <form method='POST' onSubmit={submitComment} className='add-cmnt-container w-100 d-flex justify-content-center align-items-center gap-3'>
      <textarea
        value={commentContent}
        onChange={commentChanged}
        onKeyDown={handleKeyDown}
        className='comment-textarea w-100 rounded-3 text-light fw-bold'
        placeholder='Add a comment'
        autoFocus
        autoComplete='off'
        autoCorrect='off'
      ></textarea>
      <span>
        <button type='submit' className='submit-cmnt bg-warning rounded-circle border-0 fs-4'>
          <IoSend className='ms-1' />
        </button>
      </span>
    </form>
  )
}

export default AddComment
