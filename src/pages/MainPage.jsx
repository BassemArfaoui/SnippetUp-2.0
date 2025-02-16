import React , {useContext} from 'react'
import FeedSide from '../components/main/FeedSide'
import '../css/MainPage.css'
import { Helmet } from 'react-helmet'
import userContext from "../components/contexts/userContext";



function MainPage() {

  const {user}=useContext(userContext);

  return (
    <div className='main-page'>  
      <Helmet>
        <title>SnippetUp : Snippets Sharing Platform</title>
      </Helmet>     
          <FeedSide user={user}/>
    </div>
  )
}

export default MainPage