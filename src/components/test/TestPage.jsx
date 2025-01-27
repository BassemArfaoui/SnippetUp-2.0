import React from 'react'
import ProfileSkeleton from '../profile/ProfileSkeleton';
import Hero from '../auth/Hero';
import Login from '../auth/Login';
import LoginRegisterContainer from '../auth/LoginRegisterContainer';


function TestPage() {
  return (
  <div className='d-flex justify-content-center min-vh-100' style={{backgroundColor :'rgb(193, 239, 240)' , paddingBottom : '200px'}}>
  {/* <Hero /> */}
  {/* <Login/> */}
  <LoginRegisterContainer/>
    </div>
  )
}

export default TestPage