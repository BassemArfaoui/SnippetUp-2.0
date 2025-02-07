import React, { useState, useEffect } from 'react';
import { IoPersonCircleSharp } from "react-icons/io5";
import axios from 'axios';
import { notify, successNotify } from '../tools/CustomToaster';

function ProfilePicChanger({ userId , setChoice }) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/dwq4a8g1r/image/upload/v1738410320/profile_pictures/ifgf59gkqstnmevtppi1.png");
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Upload file when `file` state changes
  useEffect(() => {
    const handleUpload = async () => {
      if (!file) return;

      setUploadingPicture(true);
      const formData = new FormData();
      formData.append("profilePic", file);
      if(!userId) 
      {
        notify('Something Went Wrong , you can change your profile picture later')
        setChoice('login')
      }

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/${userId}/upload`, formData);
        const data = response.data;

        if (data.success) {
          setImageUrl(data.imageUrl); 
          successNotify('Picture Uploaded Successfully, Click finish to confirm')
        } else {
          console.error("Upload failed:", data.message);
        }
      } catch (error) {
        console.error("Error uploading profile Picture:", error);
        notify("Error uploading profile Picture");
      } finally {
        setUploadingPicture(false);
      }
    };

    handleUpload();
  }, [file, userId]); 

  return (
    <div>
      <label className="fw-bold mt-2 mb-2 align-self-center mx-3" style={{ fontSize: "19px", color: "#363738" }}>
        Please Choose a Profile Picture:
      </label>

      <div className='d-flex justify-content-center mb-3 mt-3'>
        <img className='rounded-3' src={imageUrl} alt='Profile' style={{ width: '150px', height: '150px', border: '3px solid' }} />
      </div>

      {/* File Upload Input */}
      <div className="my-1 py-2 form-control rounded-4 login-input d-flex align-items-center pe-2">
        <span className="d-flex align-items-center me-2" style={{ fontSize: "24px", color: file ? "rgb(88, 166, 211)" : "rgb(171, 165, 165)" }}>
          <IoPersonCircleSharp />
        </span>

        <input
          type="file"
          id="profile_pic"
          className="d-none"
          onChange={handleFileChange}
        />

        <label htmlFor="profile_pic" className="d-flex py-2 align-items-center cursor-pointer ms-1 w-100 overflow-x-hidden" style={{ fontSize: "18px", color: file ? "rgb(88, 166, 211)" : "rgb(171, 165, 165)" }}>
          {file ? <span className="mb-1">{file.name}</span> : "Click to upload"}
        </label>
      </div>

      <button className="mt-4 px-5 mx-5 btn login-btn mb-1 text-capitalize rounded-4 bg-primary py-2 text-light" onClick={()=>{setChoice('login')}} disabled={uploadingPicture || !file}>
        {uploadingPicture ? "Uploading..." : "Finish"}
      </button>

      <button onClick={()=>{setChoice('login')}} className="px-4 mt-2 mb-5 mx-5 btn back-btn mb-1 text-capitalize rounded-4 bg-light text-secondary border-3 border-secondary">
        Skip
      </button>
    </div>
  );
}

export default ProfilePicChanger;
