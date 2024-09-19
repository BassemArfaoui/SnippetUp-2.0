import React , {useState} from 'react'
import '../css/SavedPage.css'
import SavedChoice from '../components/saved/SavedChoice'
import SavedContainer from '../components/saved/SavedContainer';
import SavedPosts from '../components/saved/SavedPosts';



function SavedPage() {
  
  const [choice,setChoice]=useState('posts');
  

  return (



    <div className='min-vh-100'> 
       <SavedChoice choice={choice} setChoice={setChoice}/>
           
       <SavedContainer>
          {
            choice==='posts' ? <SavedPosts/>
            : null
          }
       </SavedContainer>
    </div>
  )
}

export default SavedPage