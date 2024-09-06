import React from 'react'
import './styles/Feed.css'
import Post from '../parts/Post'
import NotificationBell from './NotificationsBell'
function FeedSide() {
  return (
    <div className="col-lg-12 p-0 pt-1">
        <div className="feed-side d-flex flex-column gap-2  " >
          <NotificationBell/>
          <div className='pt-3'></div>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
  
        </div>
    </div>
  )
}

export default FeedSide