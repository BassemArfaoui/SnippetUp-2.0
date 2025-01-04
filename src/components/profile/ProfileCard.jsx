import React from "react";
import { Button, Card, CardContent } from "@mui/material";
import '../../css/ProfilePage.css'

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

export default function ProfileCard() {
  // Data variables
  const username = "Bassem Arfaoui";
  const fullName = "Artificial Intelligence | AI";
  const profilePicture = "https://picsum.photos/200";
  const posts = 151;
  const followers = 274111000;
  const points = 8500;
  const bio = `
    → Everything about AI 🤖
    → Daily tips, tricks & news
    → DM for collab/promo
  `;

  return (
    <CardContent className="p-4">
    <div className="d-flex flex-column align-items-center text-center py-4">
      <div className="d-flex align-items-center gap-5">
        <div className="me-3">
          {/* Circular Profile Picture with Gradient Border */}
          <div
            className="position-relative  rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "180px",
              height: "180px",
              padding: "3px",
              background:
                "#8cbce7"     
              }}  >
            <img
              src={profilePicture}
              alt={`${username}'s profile`}
              className="rounded-circle w-100 h-100 object-fit-cover"

            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="mt-0">
              <h2 className="fw-bolder text-start text-light my-0">{username}</h2>
              <p className="text-start text-secondary fs-5 my-0">
                @ArfBassem
              </p>
              {/* Text in darker blue */}
            </div>
          </div>
          <div className="d-flex justify-content-around w-100 mt-3 gap-5">
            <div className="profile-stat">
              <p className="m-0 fw-bold fs-4 text-light">{posts}</p>
              <p className="m-0 small fs-5 text-secondary">Posts</p>
            </div>
            <div className="profile-stat">
              <p className="m-0 fw-bold fs-4 text-light">
                {formatNumber(followers)}
              </p>
              <p className="m-0 small fs-5 text-secondary">Subscribers</p>
            </div>
            <div className="profile-stat">
              <p className="m-0 fw-bold fs-4 text-light">{formatNumber(points)}</p>
              <p className="m-0 small fs-5 text-secondary">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="d-flex gap-3 mt-3">
      <Button
        variant="contained"
        style={{
          backgroundColor: "#1E88E5", // Blue button
          color: "#ffffff",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        Follow
      </Button>
      <Button
        variant="outlined"
        style={{
          borderColor: "#1E88E5",
          color: "#1E88E5",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        Message
      </Button>
    </div> */}
    </div>
  </CardContent>
  );
}
