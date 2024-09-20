import React , {useEffect, useState} from 'react'
import './styles/search.css'

function SavedPostsSearch(props) {




    const postsSearchChanged=(e)=>{
        props.setPostsSearch(e.target.value);
    }

    const localSearchChanged=(e)=>{
        props.setLocalSearch(e.target.value);
    }


    useEffect (()=>{
        if(props.postsSearch && props.choice==='posts')
        {
            props.setIsSearching('posts')
        }
        else if (props.localSearch && props.choice==='local')
        {
            props.setIsSearching('local')
        }
        else
        {
            props.setIsSearching('none')
        }
    },[props.postsSearch, props.localSearch])



  return (
    <div>
        { props.choice==='posts' ? <div className='w-100 d-flex justify-content-center align-items-center'>
            <input type='text' placeholder='Search Saved Posts' className='form-control saved-posts-input bg-light fw-bolder  py-2 ps-4' style={{width:'450px',outline:'none'}} value={props.postsSearch} onChange={postsSearchChanged}/>
        </div>  :

        <div className='w-100 d-flex justify-content-center align-items-center'>
            <input type='text' placeholder='Search Local Snippets' className='form-control saved-posts-input bg-light fw-bolder  py-2 ps-4' style={{width:'450px',outline:'none'}} value={props.localSearch} onChange={localSearchChanged} />
        </div>
        }
    </div>
  )
}

export default SavedPostsSearch