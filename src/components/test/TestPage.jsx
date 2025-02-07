import React from 'react'
import ProfileSkeleton from '../profile/ProfileSkeleton';
import LoginRegisterContainer from '../auth/LoginRegisterContainer';
import Hero from '../auth/Hero';
import ProfileUploader from './ProfileUploader';
import SearchModal from '../search/SearchModal';
import ProfilePicChanger from '../auth/ProfilePicChanger';


function TestPage() {
  return (
  <div className=' justify-content-center min-vh-100' style={{backgroundColor :'rgb(193, 239, 240)' , paddingBottom : '200px'}}>
  <ProfileUploader />
  <ProfilePicChanger id={1} />
    </div>
  )
}

export default TestPage