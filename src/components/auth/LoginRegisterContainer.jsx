import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './styles/auth.css'
import LoginRegisterForm from './LoginRegisterForm';

const LoginRegisterContainer = () => {
  const [choice, setChoice] = useState('login');
  const borderBottom = '3px solid  lightgray ';
  return (
    <div className="auth-container text-center rounded-4 mt-3 bg-light" style={{width:'420px' }}>
      <div className='w-100 d-flex mb-3 mt-2' style={{height : '50px'  , }}>
        <button  className={'btn btn-left flex-grow-1 rounded-0 d-flex align-items-center justify-content-end me-3' + (choice==='login' ? ' text-primary' : ' text-dark')}   onClick={() => setChoice('login')}>Login</button>
        <button className={'btn btn-right flex-grow-1 rounded-0 d-flex align-items-center justify-content-start ms-3' + (choice !=='login' ? ' text-primary' : ' text-dark')}  onClick={() => setChoice('register')}>Register</button>
      </div>
      <div className='container-content'>
        {/* <h1 className='text-capitalize mt-2 fw-bold' style={{fontSize:'35px'}}>{choice}</h1> */}
        <div className='mt-4'>
          <LoginRegisterForm  choice={choice}/>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterContainer;
