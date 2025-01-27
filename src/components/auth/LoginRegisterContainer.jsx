
import React, { useState } from 'react';
import './styles/auth.css'
import LoginRegisterForm from './LoginRegisterForm';

const LoginRegisterContainer = () => {
  const [choice, setChoice] = useState('login');
  const borderBottom = '3px solid  lightgray ';
  return (
    <div className="auth-container text-center rounded-4 mt-3 bg-light py-2 " style={{width:'340px'}}>
      <div className='w-100 d-flex mb-3 mt-3 gap-3' style={{height : '50px'}}>
        <button  className={'btn btn-left flex-grow-1 px-0 mx-0 rounded-0 d-flex align-items-center justify-content-center' + (choice==='login' ? ' text-primary' : ' text-dark')}   onClick={() => setChoice('login')} style={{width:'170px'}}><span className='pb-2 text-center w-100 py-2 d-flex align-items-center  justify-content-center rounded-4 ms-4' style={{backgroundColor : choice === 'login' ? '#c9e6ff' : '#e3e3e3'}}>Login</span></button>
        <button className={'btn btn-right flex-grow-1 px-0 rounded-0 d-flex align-items-center justify-content-center' + (choice !=='login' ? ' text-primary' : ' text-dark')}  onClick={() => setChoice('register')}  style={{width:'170px'}}><span className='pb-2 text-center  w-100 d-flex justify-content-center align-items-center py-2 rounded-4 me-4' style={{backgroundColor : choice !== 'login' ? '#c9e6ff' : '#e3e3e3'}}>Register</span></button>

      </div>
      <div className='container-content'>
        <div className='mt-3'>
          <LoginRegisterForm  choice={choice}/>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterContainer;
