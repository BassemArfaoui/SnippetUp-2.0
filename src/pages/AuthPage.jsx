import React from 'react'
import LoginRegisterContainer from '../components/auth/LoginRegisterContainer'

function AuthPage() {
  return (
    <div className='d-flex justify-content-center pt-4 pb-3' style={{backgroundColor :'rgb(193, 239, 240) ' , height : '100vh' , overflowY: 'auto'}}>
      <LoginRegisterContainer />
    </div>
  )
}

export default AuthPage