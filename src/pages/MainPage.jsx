import React from 'react'
import MainPageContainer from '../components/main/MainPageContainer'
import FeedSide from '../components/main/FeedSide'
import NotificationSide from '../components/main/NotificationSide'
import '../css/MainPage.css'
import Header from '../components/parts/Header'

function MainPage() {
  return (
    <div className='main-page'>
       <Header/>
       
       <MainPageContainer>
          <FeedSide/>
          <NotificationSide/>
       </MainPageContainer>
    </div>
  )
}

export default MainPage