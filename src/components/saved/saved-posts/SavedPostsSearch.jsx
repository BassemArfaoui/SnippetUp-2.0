import React , {useEffect, useContext} from 'react'
import '../styles/search.css'
import userContext from "../../contexts/userContext";


function SavedPostsSearch(props) {


  const {user}= useContext(userContext) ;
  const userId=user.id ;

    const postsSearchChanged=(e)=>{
        props.setPostsSearch(e.target.value);
        if(props.setIsFiltering !=='none')
         {
           props.cancelFilter();

         }
    }

    const localSearchChanged=(e)=>{
        props.setLocalSearch(e.target.value);
        if(props.setIsFiltering !=='none')
          {
            props.cancelFilter();

          }

    }


    useEffect (()=>{
        // if(props.isFiltering !=='none')
        // {
        //     props.setIsFilting('none')
        // }
        
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