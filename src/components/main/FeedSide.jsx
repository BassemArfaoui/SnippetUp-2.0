import React from 'react'
import './styles/Feed.css'
import Post from '../parts/Post'
function FeedSide() {
  return (
    <div className="col-lg-9 p-0">
        <div className="feed-side px-3 d-flex flex-column gap-2">
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