import React, { useEffect, useState } from "react";
import "./styles/login.css";
import { auth, provider, signInWithPopup } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Typography} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { notify, successNotify } from "../tools/CustomToaster";
import axios from "axios";
import SpinnerSpan from "../tools/SpinnerSpan";
import ProfilePicChanger from "./ProfilePicChanger";
// import { useNavigate } from "react-router-dom";





function LoginRegisterForm({ choice , setDisableLogin , setChoice}) {

  const navigate = useNavigate() ;

  const [focusedInput, setFocusedInput] = useState("");
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [registerStage, setRegisterStage] = useState(1);
  const [loginLoading , setLoginLoading] = useState(false)
  const [registerLoading , setRegisterLoading] = useState(false)
  const [checkingUsername , setCheckingUsername] = useState(false)
  const [isUsernameUsed, setIsUsernameUsed] = useState(false)
  const [userId , setUserId]= useState(null)
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);


  const [formData , setformData] = useState(
    {
      email : '',
      password : '',
      firstname :'' , 
      lastname:'',
      username :'' ,
    }
  )

  //oauth
  
  const googleLogin = async (e) => {
    e.preventDefault()
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google`, { idToken });

      console.log("JWT Token:", response.data);

      localStorage.setItem("token", JSON.stringify(response.data));

      setGoogleLoading(false);
      successNotify('logged in successfully')
     navigate('/') 
    } catch (error) {
      notify("Error signing in. Please try again.");
      setGoogleLoading(false);
      console.error("Error signing in:", error);
    }
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

 
  function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(username);
  }

  function isEmailUsed (email)
  {
    return false
  }

  const loginUser=async (loginObj)=>{
    try
    { setLoginLoading(true)
      const response =await axios.post(`${process.env.REACT_APP_API_URL}/login`, loginObj);
      if(response.data.success)
      {
        const user=response.data.user;
        localStorage.setItem('token', JSON.stringify({login:true,token:response.data.token,user:response.data.user}));
        successNotify(`Logged in Successfully, Welcome ${(response.data.user.username)} ...`);
        setLoginLoading(false);
        window.location.href = "/";
      }else
      {
        notify(response.data.error);
        setLoginLoading(false)
      }
    }catch(err)
    {
      console.log(err)
      notify("We Couldn't Login , Try again")
      setLoginLoading(false)
    }
  }

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));


  };

  const handleBlur = () => {
    setFocusedInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (choice === "login") {
      if (
        !formData.email ||
        !formData.password ||
        !formData.password.trim() ||
        !formData.email.trim()
      ) {
        notify("Please fill all the fields");
      } else 
      {
        
        await loginUser({email : formData.email , password : formData.password})
      }


    } else if (choice === "register" && registerStage === 1) {
      if (
        !formData.email ||
        !formData.password ||
        !formData.password.trim() ||
        !formData.email.trim()
      ) {
        notify("please fill all the fields");
      } else if (!isValidEmail(formData.email) || isEmailUsed(formData.email) ||!isValidPassword(formData.password) ) {
        notify("invalid email or password");
      } 
      else
      {
        setIsPwdVisible(false)
        setRegisterStage(2)
      }

    }
  };





    const handleRegister = async (e) =>
    {
      e.preventDefault()
      try
      {
        if (!((choice === "register" && registerLoading) ||
        !formData.username ||
        !formData.username.trim() ||
        !isValidUsername(formData.username) ||
        !formData.firstname ||
        !formData.firstname.trim() ||
        !formData.lastname ||
        !formData.lastname.trim()) && !checkingUsername && !isUsernameUsed) {
          setRegisterLoading(true);
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/register`,
            formData
          );
          if (response.data.success) {
            const user = response.data.user;
            setUserId(user.id)
            successNotify(
              `Registred Successfully, Welcome ${user.firstname} ${user.lastname} ...`
            );
            setRegisterLoading(false);
            setRegisterStage(3);
    
          } else {
            notify("register failed, please verify the entered infos");
            setRegisterLoading(false);
          }
        } else {
          notify("register failed, please verify the entered infos");
        }
      }catch(err)
      {
        console.log(err)
        notify('An unexpected Error occured')
        setRegisterLoading(false)
      }
      
    }

    const checkUsername = async () =>
    {
      try{
        setCheckingUsername(true)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/username-used`,{username : formData.username}) ;
        if (!response.data.is_username_used)
        {
          setCheckingUsername(false);
          setIsUsernameUsed(false)
          
        }
        else
        {
          setCheckingUsername(false);
          setIsUsernameUsed(true);
        }
        
      }
      catch (err)
      {
        console.log(err)
        notify(err.message)
      }
    }

    useEffect(() => {
      if (choice === "register" && registerStage > 1 ) {setDisableLogin(true)} else {setDisableLogin(false)};
    }, [choice, registerStage]);

  return (
    <div>
      <form className="d-flex flex-column px-4 pt-3">
        {(choice === "login" ||
          (choice == "register" && registerStage === 1)) && (
          <>
            {/* Email Input */}
            <div
              className={`my-1 py-2 form-control rounded-4 login-input d-flex align-items-center pe-2 ${
                focusedInput === "email" ? "focused-container" : ""
              }`}
            >
              <span
                className="d-flex align-items-center me-2"
                style={{
                  fontSize: "22px",
                  color:
                    focusedInput === "email"
                      ? "rgb(88, 166, 211)"
                      : "rgb(171, 165, 165)",
                }}
              >
                <MdAlternateEmail />
              </span>
              <input
                className="login-input-inside d-flex align-items-center"
                type="text"
                id="username"
                name="email"
                value={formData.email}
                placeholder="Email :"
                onFocus={() => handleFocus("email")}
                onBlur={() => {
                  handleBlur();
                  if (choice === "register") {
                  }
                }}
                onChange={handleChange}
              />
            </div>
            {choice === "register" &&
              registerStage === 1 &&
              formData.email &&
              !isValidEmail(formData.email) && (
                <div className="small text-danger fw-bold text-start ms-2 mb-2">
                  Invalid Email Format
                </div>
              )}

            {/* Password Input */}
            <div
              className={`my-1 py-2 form-control rounded-4 login-input d-flex align-items-center ${
                focusedInput === "password" ? "focused-container" : ""
              }`}
            >
              <span
                className="d-flex align-items-center me-2"
                style={{
                  fontSize: "19px",
                  color:
                    focusedInput === "password"
                      ? "rgb(88, 166, 211)"
                      : "rgb(171, 165, 165)",
                }}
              >
                <FaLock />
              </span>
              <input
                className="ms-1 border-0 login-input-inside"
                type={isPwdVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                placeholder="Password :"
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            {choice === "register" &&
              registerStage === 1 &&
              formData.password &&
              !isValidPassword(formData.password) && (
                <div className="small text-danger fw-bold text-start ms-2">
                  Password is Weak
                </div>
              )}

            <p
              className="text-end pe-3 fw-bold"
              style={{
                fontSize: "15px",
                cursor: "pointer",
                color: "rgb(88, 166, 211)",
              }}
            >
              {!isPwdVisible ? (
                <span
                  onClick={() => {
                    setIsPwdVisible(true);
                  }}
                >
                  show
                </span>
              ) : (
                <span
                  onClick={() => {
                    setIsPwdVisible(false);
                  }}
                >
                  hide
                </span>
              )}
            </p>
            {/* Submit Button */}
            <button
              className="mt-4 mx-5 btn login-btn mb-1 text-capitalize rounded-4 bg-primary py-2 text-light"
              type="submit"
              onClick={handleSubmit}
              disabled={
                !formData.email ||
                !formData.password ||
                !formData.email.trim() ||
                !formData.password.trim() ||
                (choice === "login" && loginLoading) ||
                (choice === "register" &&
                  (!isValidEmail(formData.email) ||
                    isEmailUsed(formData.email) ||
                    !isValidPassword(formData.password)))
              }
            >
              {loginLoading ? "loading ..." : choice}
            </button>

            {choice === "login" && (
              <Link
                to="#"
                className="fw-bold text-decoration-none mt-1"
                style={{ fontSize: "16px", color: "#4680e3" }}
              >
                Forgot password ?
              </Link>
            )}

            {/* Divider */}
            <div className="mx-auto" style={{ width: "90%" }}>
              <Divider
                sx={{
                  my: 2,
                  "&::before, &::after": {
                    borderColor: "grey",
                    borderWidth: "2px",
                    top: "unset",
                  },
                }}
              >
                <Typography
                  className="fw-bold"
                  variant="body1"
                  sx={{
                    px: 0,
                    color: "grey",
                    fontSize: "18px",
                  }}
                >
                  or
                </Typography>
              </Divider>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-0 px-1 mb-5">
              <button disabled={googleLoading || githubLoading} onClick={(e)=>{googleLogin(e)}}   className="oauth-btn w-100 rounded-4 text-secondary d-flex align-items-center justify-content-center gap-2">
                <span
                  className="p-0 m-0 d-flex align-items-center"
                  style={{ fontSize: "23px" }}
                 
                >
                  <FcGoogle />
                </span>
                <span>{!googleLoading ? 'Continue with Google' : 'Signing in ...'}</span>
              </button>
              <button className="oauth-btn w-100 rounded-4 my-2 text-secondary d-flex align-items-center justify-content-center gap-2">
                <span
                  className="text-dark p-0 m-0 d-flex align-items-center"
                  style={{ fontSize: "23px" }}
                >
                  <AiFillGithub />
                </span>
                <span> Continue with Github</span>
              </button>
            </div>
          </>
        )}

        {choice == "register" && registerStage === 2 && (
          <>
            <label
              className="fw-bold mt-4 mb-3 align-self-center ms-2"
              style={{ fontSize: "19px", color: "#363738" }}
            >
              Additional Infos :
            </label>

            {/* firstname input*/}
            <div
              className={`my-1 py-2 form-control rounded-4 login-input d-flex align-items-center pe-2 ${
                focusedInput === "firstname" ? "focused-container" : ""
              }`}
            >
              <span
                className="d-flex align-items-center me-2"
                style={{
                  fontSize: "22px",
                  color:
                    focusedInput === "firstname"
                      ? "rgb(88, 166, 211)"
                      : "rgb(171, 165, 165)",
                }}
              >
                <IoPerson />
              </span>
              <input
                className="login-input-inside d-flex align-items-center"
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                placeholder="First Name :"
                onFocus={() => handleFocus("firstname")}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            {/* lastname Input */}
            <div
              className={`my-1 py-2 form-control rounded-4 login-input d-flex align-items-center pe-2 ${
                focusedInput === "lastname" ? "focused-container" : ""
              }`}
            >
              <span
                className="d-flex align-items-center me-2"
                style={{
                  fontSize: "22px",
                  color:
                    focusedInput === "lastname"
                      ? "rgb(88, 166, 211)"
                      : "rgb(171, 165, 165)",
                }}
              >
                <IoPerson />
              </span>
              <input
                className="login-input-inside d-flex align-items-center"
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                placeholder="Last Name :"
                onFocus={() => handleFocus("lastname")}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            {/* username Input */}
            <div
              className={`my-1 py-2 form-control rounded-4 login-input d-flex align-items-center pe-2 ${
                focusedInput === "username" ? "focused-container" : ""
              }`}
            >
              <span
                className="d-flex align-items-center me-2"
                style={{
                  fontSize: "22px",
                  color:
                    focusedInput === "username"
                      ? "rgb(88, 166, 211)"
                      : "rgb(171, 165, 165)",
                }}
              >
                <IoPerson />
              </span>
              <input
                className="login-input-inside d-flex align-items-center"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                placeholder="Userame :"
                onFocus={() => handleFocus("username")}
                onBlur={async()=>
                {
                  handleBlur();
                  await checkUsername() ;
                }}
                onChange={handleChange}

              />
              {  checkingUsername && 
                <span
                  className="d-flex align-items-center me-2"
                  style={{
                    fontSize: "22px",
                    color:
                      focusedInput === "username"
                        ? "rgb(88, 166, 211)"
                        : "rgb(171, 165, 165)",
                  }}
                >
                  <SpinnerSpan spanStyle={{ width: "25px", height: "25px" }} />
                </span>
              }
            </div>
            {choice === "register" &&
              registerStage === 2 &&
              formData.username &&
              !isValidUsername(formData.username) && (
                <div className="small text-danger fw-bold text-start ms-2 ">
                  Invalid Username
                </div>
              )}

              {isUsernameUsed && (
                <div className="small text-danger fw-bold text-start ms-2 ">
                  Username already used
                </div>
              )}

            {/*finish button */}
            <button
              className="mt-5 mx-5 btn login-btn mb-1 text-capitalize rounded-4 bg-primary py-2 text-light"
              onClick={handleRegister}
              disabled={
                (choice === "register" && registerLoading) ||
                !formData.username ||
                !formData.username.trim() ||
                !isValidUsername(formData.username) ||
                !formData.firstname ||
                !formData.firstname.trim() ||
                !formData.lastname ||
                !formData.lastname.trim() || checkingUsername || isUsernameUsed
              }
            >
              {!registerLoading ? "Submit" : "Loading ..."}
            </button>

            <button
              className="mt-2 mb-5 mx-5 btn back-btn mb-1 text-capitalize rounded-4 bg-light text-secondary    border-3 border-secondary"
              onClick={() => {
                setRegisterStage(1);
              }}
              disabled={registerLoading}
            >
              Cancel
            </button>
      
          </>
        )}
        { (choice == "register" && registerStage === 3) &&
           <ProfilePicChanger userId={userId} setChoice={setChoice}/>}
      </form>
    </div>
  );
}

export default LoginRegisterForm;
