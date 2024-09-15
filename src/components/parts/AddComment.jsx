import React from 'react'
import './styles/AddComment.css'
import { IoSend } from "react-icons/io5";
function AddComment() {
  return (
    <div className='add-cmnt-container w-100 d-flex justify-content-center align-items-center gap-3'>
        <textarea className='comment-textarea w-100 rounded-3 text-light fw-bold' placeholder='Add a comment' autoFocus autoComplete='off' autoCorrect='off'></textarea>
        <span>
            <button className='submit-cmnt bg-warning rounded-circle border-0 fs-4' >
                <IoSend className='ms-1'/> 
            </button>
        </span>
    </div>
  )
}

export default AddComment