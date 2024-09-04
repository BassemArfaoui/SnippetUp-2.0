import React from 'react'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import './styles/Notification.css'


function Notification(props) {
    const userName='John Doe';
    const SnippetTitle='Fibonaci function'
  return (
    <div>
        {
            props.type==='like' && 
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <div className="noti-btn bg-primary text-light rounded-circle d-flex align-items-center justify-content-center px-2" style={{width:'40px',height:'40px'}}>
                <ThumbUpAltIcon />
              </div>
              <div className='w-100'>
                <p className="text-muted mb-0 fw-bold"><strong className='text-black'>{userName}</strong> liked your Snippet : <strong className='text-black'>{SnippetTitle}</strong></p>
              </div>
            </div>
        }

        {
            props.type==='comment' && 
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <div className="noti-btn text-light rounded-circle d-flex align-items-center justify-content-center px-2" style={{width:'40px',height:'40px',backgroundColor:'rgb(255, 98, 0)'}}>
                <CommentIcon />
              </div>
              <div className='w-100'>
                <p className="text-muted mb-0 fw-bold"><strong className='text-black'>{userName}</strong> Commented on your Snippet : <strong className='text-black'>{SnippetTitle}</strong></p>
              </div>
            </div>
        }
    </div>
  )
}

export default Notification