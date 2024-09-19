import React , {useState} from 'react'
import '../css/SavedPage.css'
import SavedChoice from '../components/saved/SavedChoice'
import SavedPosts from '../components/saved/SavedPosts';
import SavedLocal from '../components/saved/SavedLocal';



function SavedPage() {
  
  const [showChoice,setShowChoice]=useState(true);
  const [choice,setChoice]=useState('posts');

  

  return (



    <div className='saved-page'> 
       {showChoice && <SavedChoice choice={choice} setChoice={setChoice}/>}
           
          {
            choice==='posts' ? <SavedPosts setShowChoice={setShowChoice}/>
            : <SavedLocal  setShowChoice={setShowChoice}/>
          }
    </div>
  )
}

export default SavedPage