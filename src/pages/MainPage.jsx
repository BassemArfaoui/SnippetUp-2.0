import React from 'react'
import MainPageContainer from '../components/main/MainPageContainer'
import FeedSide from '../components/main/FeedSide'
import '../css/MainPage.css'
import Header from '../components/parts/Header'

function MainPage() {
  return (
    <div className='main-page'>       
          <FeedSide/>
    </div>
  )
}

export default MainPage