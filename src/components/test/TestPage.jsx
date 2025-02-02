import React from 'react'
import ProfileSkeleton from '../profile/ProfileSkeleton';
import LoginRegisterContainer from '../auth/LoginRegisterContainer';
import Hero from '../auth/Hero';
import ProfileUploader from './ProfileUploader';


function TestPage() {
  return (
  <div className='d-flex justify-content-center min-vh-100' style={{backgroundColor :'rgb(193, 239, 240)' , paddingBottom : '200px'}}>
  <ProfileUploader />
    </div>
  )
}

export default TestPage