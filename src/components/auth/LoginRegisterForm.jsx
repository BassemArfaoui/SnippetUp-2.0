import React from 'react'
import './styles/login.css'
import { Link } from 'react-router-dom'

function LoginRegisterForm({choice}) {
  return (
    <div>
    <form className='d-flex flex-column px-4 pt-3'>
      <input className='my-1 mb-2 form-control login-input rounded-4' type="text" id="username" name="username" placeholder="Email :" />

      <input className=' my-1 py-2 form-control rounded-4 login-input' type="password" id="password" name="password" placeholder="Password :" />


      <button className='mt-4 mx-5 btn login-btn mb-1 text-capitalize rounded-4 bg-primary py-2 text-light' type="submit">{choice}</button>
      { choice === 'login' && <Link to="#" className='fw-bold text-decoration-none mb-5' style={{fontSize:'17px', color : '#4680e3' }} > Forgot password ?</Link>}
    </form>
  </div>
  )
}

export default LoginRegisterForm