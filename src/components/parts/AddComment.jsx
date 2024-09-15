import React, { useEffect, useState , useRef } from 'react';
import './styles/AddComment.css';
import { IoSend } from "react-icons/io5";
import { successNotify } from '../tools/CustomToaster';

function AddComment(props) {
  const [commentContent, setCommentContent] = useState('');
  const [placeholder,setPlaceholder]=useState('Add a comment');
  const textareaRef =useRef(null);

  useEffect(()=>{
    if(props.reply)
    {
      setCommentContent('@' + props.commentToReply.commentorName + ' ')
      setPlaceholder(`Reply to ${props.commentToReply.commentorName}`)
      textareaRef.current.focus();

    }
  },[props.commentToReply])

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
   {if(!props.reply)
    {
      await props.addComment(commentContent,false,null);
    }
    else
    {
      await props.addComment(commentContent, true, props.commentToReply.commentId);
      setPlaceholder('Add a comment')
      props.setIsReply(false);
    }
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
        placeholder={placeholder}
        autoFocus
        autoComplete='off'
        autoCorrect='off'
        ref={textareaRef}
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
