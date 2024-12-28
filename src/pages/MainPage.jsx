import React from 'react'
import FeedSide from '../components/main/FeedSide'
import '../css/MainPage.css'
import { Helmet } from 'react-helmet'

function MainPage() {
  return (
    <div className='main-page'>  
      <Helmet>
        <title>SnippetUp : Snippets Sharing Platform</title>
      </Helmet>     
          <FeedSide/>
    </div>
  )
}

export default MainPage