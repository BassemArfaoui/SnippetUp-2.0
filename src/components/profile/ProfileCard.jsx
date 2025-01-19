import React from "react";
import { CardContent , Card } from "@mui/material";
import "../../css/ProfilePage.css";
import "../saved/styles/choice.css";

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

export default function ProfileCard({ activeTab, setActiveTab }) {
  const username = "Bassem Arfaoui";
  const profilePicture = "https://picsum.photos/200";
  const posts = 151;
  const followers = 274111000;
  const points = 8500;

  return (
  <div>
              <Card className=" profile-card w-100  rounded-4">
      <CardContent className="px-0 pb-0 pt-4 mb-3 pb-3">
      <div className="d-flex flex-column align-items-center text-center pt-0 pb-0">
        <div className="d-flex align-items-center gap-5">
          <div className="me-3">
            <div
              className="position-relative rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "155px",
                height: "155px",
                padding: "3px",
                background: "#8cbce7",
              }}
            >
              <img
                src={profilePicture}
                alt={`${username}'s profile`}
                className="rounded-circle w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-3">
              <h2 className="fw-bolder text-start text-light my-0" style={{fontSize:'28px'}}>{username}</h2>
              <p className="text-start text-secondary  my-0" style={{fontSize:'20px'}}>@ArfBassem</p>
            </div>
            <div className="d-flex justify-content-around w-100 mt-0 gap-5">
              <div className="profile-stat">
                <p className="m-0 fw-bold text-light" style={{fontSize:'23px'}}>{posts}</p>
                <p className="m-0 small text-secondary" style={{fontSize:'22px'}}>Posts</p>
              </div>
              <div className="profile-stat">
                <p className="m-0 fw-bold text-light" style={{fontSize:'23px'}}>
                  {formatNumber(followers)}
                </p>
                <p className="m-0 small text-secondary" style={{fontSize:'22px'}}>Subscribers</p>
              </div>
              <div className="profile-stat">
                <p className="m-0 fw-bold " style={{fontSize:'23px' , color : '#8cbce7'}}>
                  {formatNumber(points)}
                </p>
                <p className="m-0 small " style={{fontSize:'22px',  color : '#8cbce7'}}>Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Section */}
   
      </div>
      
    </CardContent>


    <div className="d-flex choice-sub-container mt-5 justify-content-center mb-3">
      <div  className="d-flex">
      <span>
            {activeTab === "Posts" ? (
              <div className="bg-primary text-light left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center">
                Posts
              </div>
            ) : (
              <div
                className="bg-light text-dark left-choice px-3 fw-bold fs-5 d-flex align-items-center justify-content-center"
                onClick={() => setActiveTab("Posts")}
              >
                Posts
              </div>
            )}
          </span>

          <span>
            {activeTab === "Infos" ? (
              <div className="right-choice fs-5 px-3 text-light fw-bold bg-primary text-light d-flex align-items-center justify-content-center">
                Infos
              </div>
            ) : (
              <div
                className="right-choice bg-light text-dark fs-5 px-3 fw-bold d-flex align-items-center justify-content-center"
                onClick={() => setActiveTab("Infos")}
              >
                Infos
              </div>
            )}
          </span>
        </div>
      </div> 
    </Card>

  </div>
  );
}
