import React from 'react'
import './styles/Feed.css'
import Post from '../parts/Post'
import NotificationBell from './NotificationsBell'
function FeedSide() {
  return (
    <div className="col-lg-12 p-0">
        <div className="feed-side ps-4 pe-3  d-flex flex-column gap-2 pt-3 ">
          <NotificationBell/>
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