// ProfileUploader.js
import { useState } from "react";

const ProfileUploader = () => {
    const userId = "86";
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      // Replace with your backend URL
      const response = await fetch(`http://localhost:4000/${userId}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.imageUrl); // Set the image URL from the backend response
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="Profile" width="100" />}
    </div>
  );
};

export default ProfileUploader;
