import React, { useState } from 'react'
import './styles/choice.css'
import SavedPostsSearch from './saved-posts/SavedPostsSearch'

function SavedChoice(props) {


 
  

  return (
    <div className='saved-choice-container d-flex justify-content-center align-items-center flex-column gap-3'>
        <div className='d-flex choice-sub-container'>
            {
               props.choice === 'posts'? <div className=' bg-primary text-light left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center text-light' >Saved Posts</div>
               : <div className=' bg-light text-dark left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center text-light' onClick={()=>{props.setLocalSearch('');props.setPostsSearch('');props.setIsFiltering('none');props.setChoice('posts')}}>Saved Posts</div>
            }
            {
                props.choice === 'local' ? <div className='right-choice fs-5 px-3 text-light fw-bold bg-primary text-light d-flex align-items-center justify-content-center'>Local Snippets</div>
                : <div className='right-choice bg-light text-dark fs-5 px-3 fw-bold d-flex align-items-center justify-content-center' onClick={()=>{
                if(props.isFiltering !== 'none' ){props.setIsFiltering('none');}
                props.setLocalSearch('');
                props.setPostsSearch('');
                props.setChoice('local')}}>
                Local Snippets</div>
            }
        </div>

        <SavedPostsSearch choice={props.choice} setIsSearching ={props.setIsSearching} postsSearch={props.postsSearch} localSearch={props.localSearch} setLocalSearch={props.setLocalSearch} setPostsSearch={props.setPostsSearch}  isFiltering={props.isFiltering} cancelFilter={props.cancelFilter} />
    </div>
  )
}

export default SavedChoice