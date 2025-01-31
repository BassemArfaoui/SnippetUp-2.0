import React from 'react'
import LoginRegisterContainer from '../components/auth/LoginRegisterContainer'
import Hero from '../components/auth/Hero'

function AuthPage() {
  return (
    <div className='d-flex row justify-content-center align-items-center pt-4 pb-5' style={{backgroundColor :'rgb(193, 239, 240) ' , height : '100vh' , overflowY: 'auto'}}>
      <div className='col-md-6 d-flex justify-content-lg-end justify-content-center'>
        <LoginRegisterContainer />
      </div>
      <div className='col-md-6 d-flex justify-content-start'>
        <Hero />
      </div>
    </div>
  )
}

export default AuthPage ;