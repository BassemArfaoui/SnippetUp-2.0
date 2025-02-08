import React from 'react'
import ProfilePicChanger from '../auth/ProfilePicChanger';
import GoogleLogin from './GoogleLogin';


function TestPage() {
  return (
  <div className=' justify-content-center min-vh-100' style={{backgroundColor :'rgb(193, 239, 240)' , paddingBottom : '200px'}}>
  <ProfilePicChanger id={1} />
  <GoogleLogin />

    </div>
  )
}

export default TestPage