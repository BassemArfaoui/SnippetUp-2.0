import React, { useState } from "react";
import "./styles/login.css";
import { Link } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

function LoginRegisterForm({ choice }) {
  const [focusedInput, setFocusedInput] = useState("");

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput("");
  };

  return (
    <div>
      <form className="d-flex flex-column px-4 pt-3">
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
              color: focusedInput === "email" ? "rgb(88, 166, 211)" : "rgb(171, 165, 165)",
            }}
          >
            <MdAlternateEmail />
          </span>
          <input
            className="login-input-inside d-flex align-items-center"
            type="text"
            id="username"
            name="username"
            placeholder="Email :"
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
          />
        </div>

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
              color: focusedInput === "password" ? "rgb(88, 166, 211)" : "rgb(171, 165, 165)",
            }}
          >
            <FaLock />
          </span>
          <input
            className="ms-1 border-0 login-input-inside"
            type="password"
            id="password"
            name="password"
            placeholder="Password :"
            onFocus={() => handleFocus("password")}
            onBlur={handleBlur}
          />
        </div>

        {/* Submit Button */}
        <button
          className="mt-4 mx-5 btn login-btn mb-1 text-capitalize rounded-4 bg-primary py-2 text-light"
          type="submit"
        >
          {choice}
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
      </form>

      {/* Divider */}
      <div className="mx-auto" style={{ width: "78%" }}>
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
      <div className="mt-0 px-4 mb-5">
        <button className="oauth-btn w-100 rounded-4 text-secondary d-flex align-items-center justify-content-center gap-2">
          <span
            className="p-0 m-0 d-flex align-items-center"
            style={{ fontSize: "23px" }}
          >
            <FcGoogle />
          </span>
          <span>Continue with Google</span>
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
    </div>
  );
}

export default LoginRegisterForm;
