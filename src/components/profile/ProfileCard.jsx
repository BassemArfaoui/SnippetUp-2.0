import React, { useState , useContext} from "react";
import { CardContent, Card } from "@mui/material";
import "../../css/ProfilePage.css";
import "../saved/styles/choice.css";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CustomTooltip from "../tools/CustomTooltip";
import SpinnerSpan from "../tools/SpinnerSpan";
import { notify, successNotify } from "../tools/CustomToaster";
import api from "../tools/api";
import userContext from "../contexts/userContext";
import { IoRefreshCircleSharp } from "react-icons/io5";



function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

// Function to determine the profile color based on the credit
const getProfileColor = (credit) => {

  if (credit >= 10000) {
    return '#4d4dff'; 
  } else if (credit >= 5000) {
    return  '#9999ff'; 
  } else if (credit >= 3000) {
    return  '#0d6efd';
  } else if (credit >= 1000) {
    return '#00aaff'; 
  } else if (credit >= 100) {
    return '#80d4ff'; 
  } else if (credit >0){
    return '#ffffff';
  } else {
    return "gray"
  }
};



export default function ProfileCard({ uid, activeTab, setActiveTab ,firstname , lastname , username  , profilePicture , posts, subs , credit , subscribed , refreshProfilePage}) {


  const profileColor = getProfileColor(credit)
  const {user}= useContext(userContext) ;
  const myUsername = user.username ;
  const [subLoading , setSubLoading] = useState(false)
  const [isSubscribed , setIsSubscribed] = useState(subscribed)
  const [subsCount , setSubsCount] = useState(subs)


  const subscribe = async () => {
    try {
      setSubLoading(true);
      await api.get(
        `/sub/${uid}`
      );
      setSubsCount(prevCount => prevCount + 1);
      setSubLoading(false);
      setIsSubscribed(true);
      successNotify(
        `You are now Subscribed to ${
          firstname + " " + lastname
        }`
      );
    } catch (err) {
      notify(`Couldn't subscribe`);
    }
  };

  const unsubscribe = async () => {
    try {
      setSubLoading(true);
      await api.get(
        `/unsub/${uid}`
      );
      setSubsCount(prevCount => prevCount - 1);
      setSubLoading(false);
      setIsSubscribed(false);
      successNotify(
        `No Longer Subscribed to  ${
         firstname + " " + lastname
        }`
      );
    } catch (err) {
      notify(`Couldn't unsubscribe`);
    }
  };



  return (
    <div>
      <Card className=" profile-card w-100 rounded-4 position-relative text-primary" style={{backgroundColor : 'rgb(24, 22, 22)'}}>
        <CardContent className="px-0 pb-0 pt-4 mb-3 pb-3">
          <div className="d-flex flex-column align-items-center text-center pt-0 pb-0">
            <div className="d-flex align-items-center gap-5">
              <div className="me-3">
                <div
                  className="position-relative rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "155px",
                    height: "155px",
                    padding: "2.5pt",
                    background: profileColor,
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
                  <div className="d-flex gap-3 align-items-center">
                    <h2
                      className="fw-bolder text-start text-light my-0"
                      style={{ fontSize: "28px" }}
                    >
                      {firstname + " " + lastname}
                    </h2>
                    {username !== myUsername && (
                      <span>
                        {!subLoading ? (
                          !isSubscribed ? (
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={subscribe}
                            >
                              <CustomTooltip title="Subscribe" placement="top">
                                <StarBorderIcon style={{ fontSize: "33px" }} />
                              </CustomTooltip>
                            </span>
                          ) : (
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={unsubscribe}
                            >
                              <CustomTooltip
                                title="Unsubscribe"
                                placement="top"
                              >
                                <StarIcon style={{ fontSize: "33px" }} />
                              </CustomTooltip>
                            </span>
                          )
                        ) : (
                          <SpinnerSpan
                            spanStyle={{ width: "25px", height: "25px" }}
                          />
                        )}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-start text-secondary  my-0"
                    style={{ fontSize: "20px" }}
                  >
                    {"@" + username}
                  </p>
                </div>
                <div className="d-flex justify-content-around w-100 mt-0 gap-5">
                  <div className="profile-stat">
                    <p
                      className="m-0 fw-bold text-light"
                      style={{ fontSize: "23px", color: "#ffffff" }}
                    >
                      {formatNumber(posts)}
                    </p>
                    <p
                      className="m-0 small"
                      style={{ fontSize: "22px", color: "#ffffff" }}
                    >
                      posts
                    </p>
                  </div>
                  <div className="profile-stat">
                    <p
                      className="m-0 fw-bold text-light"
                      style={{ fontSize: "23px", color: "#ffffff" }}
                    >
                      {formatNumber(subsCount)}
                    </p>
                    <p
                      className="m-0 small"
                      style={{ fontSize: "22px", color: "#ffffff" }}
                    >
                      subscribers
                    </p>
                  </div>
                  <div className="profile-stat">
                    <p
                      className="m-0 fw-bold"
                      style={{ fontSize: "23px", color: profileColor }}
                    >
                      {formatNumber(credit)}
                    </p>
                    <p
                      className="m-0 small "
                      style={{ fontSize: "22px", color: profileColor }}
                    >
                      points
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Section */}
          </div>
        </CardContent>

        <div className="d-flex choice-sub-container mt-5 justify-content-center mb-3">
          <div className="d-flex">
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
              {activeTab === "Solves" ? (
                <div className="right-choice fs-5 px-3 text-light fw-bold bg-primary text-light d-flex align-items-center justify-content-center">
                  Demands
                </div>
              ) : (
                <div
                  className="right-choice bg-light text-dark fs-5 px-3 fw-bold d-flex align-items-center justify-content-center"
                  onClick={() => setActiveTab("Solves")}
                >
                  Demands
                </div>
              )}
            </span>
          </div>
        </div>
        <span
          className="position-absolute top-0 start-0 ms-2 mt-2"
          onClick={refreshProfilePage}
          style={{cursor:'pointer'}}
        >
          <IoRefreshCircleSharp style={{fontSize:'29px'}}/>
        </span>
      </Card>
    </div>
  );
}
