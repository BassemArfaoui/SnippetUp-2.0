import React from 'react'
import './styles/search-result.css'



function PostsSearch(props) {
  return (
    <div className='search-result-container'>{`posts search for ${props.postsSearch} ...`}</div>
  )
}

export default PostsSearch