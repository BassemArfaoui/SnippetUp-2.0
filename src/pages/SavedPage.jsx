import React , {useState} from 'react'
import '../css/SavedPage.css'
import SavedChoice from '../components/saved/SavedChoice'
import SavedPosts from '../components/saved/SavedPosts';
import SavedLocal from '../components/saved/SavedLocal';
import PostsSearch from '../components/saved/PostsSearch';
import LocalSearch from '../components/saved/LocalSearch';



function SavedPage() {
  
  const [showChoice,setShowChoice]=useState(true);
  const [choice,setChoice]=useState('posts');
  const [isSearching,setIsSearching]=useState('none');
  const [postsSearch , setPostsSearch]=useState('');
  const [localSearch, setLocalSearch]=useState('');

  

  return (



    <div className='saved-page'> 
        {showChoice &&
         <SavedChoice choice={choice} setChoice={setChoice} setIsSearching={setIsSearching} localSearch={localSearch} postsSearch={postsSearch} setLocalSearch={setLocalSearch} setPostsSearch={setPostsSearch} />
        }
           
        {
          isSearching === 'none' ?
          <>{
            choice==='posts' ? <SavedPosts setShowChoice={setShowChoice}/>
            : <SavedLocal  setShowChoice={setShowChoice}/>
            } </> :
           <>
            {
              isSearching==='posts' ? <PostsSearch postsSearch={postsSearch}/>
              : <LocalSearch localSearch={localSearch} />
            }
           </>
        }
    </div>
  )
}

export default SavedPage