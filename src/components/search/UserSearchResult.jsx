import React, { useContext } from "react";
import { Card, CardContent, Avatar, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import { MdOutlineOpenInNew } from "react-icons/md";
import CustomTooltip from '../tools/CustomTooltip';
import userContext from "../contexts/userContext";
import CloseIcon from "@mui/icons-material/Close";
import { Highlight } from "react-instantsearch";



function UserSearchResult({history , hit, setIsSearchModalOpen , id , fullname , username , profile_pic ,handleRemoveFromHistory }) {
  const navigate = useNavigate()
  const { user } = useContext(userContext);
  const userId = user.id;



  const navigateToProfile = (username) => {
    navigate(`/${username}`)
    setIsSearchModalOpen(false);
    saveToHistory();

  };

  const saveToHistory = () => {
    const currentTimestamp = Date.now();
    const newUserData = {
      id,
      fullname,
      username,
      profile_pic,
      timestamp: currentTimestamp,
    };

    let historyData = JSON.parse(localStorage.getItem("UsersSearchHistory")) || {};

    if (!Array.isArray(historyData[userId])) {
      historyData[userId] = [];
    }

    let userHistory = historyData[userId];

    const existingIndex = userHistory.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      userHistory.splice(existingIndex, 1);
    }

    userHistory.push(newUserData);

    userHistory.sort((a, b) => b.timestamp - a.timestamp);

    if (userHistory.length > 15) {
      userHistory = userHistory.slice(0, 15);
    }

    historyData[userId] = userHistory;
    localStorage.setItem("UsersSearchHistory", JSON.stringify(historyData));
  };


  const deleteFromHistory = (id) => {
    let historyData = JSON.parse(localStorage.getItem("UsersSearchHistory")) || {};

    if (Array.isArray(historyData[userId])) {
      let userHistory = historyData[userId];

      userHistory = userHistory.filter((item) => item.id !== id);

      historyData[userId] = userHistory;
      localStorage.setItem("UsersSearchHistory", JSON.stringify(historyData));
      handleRemoveFromHistory(id)
    }
  };

  return (
    <Card
      onClick={()=>{if(!history) navigateToProfile(username)}}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgb(24, 22, 22)', 
        color: '#ffffff', 
        border : '1px solid darkgray'
      }}
      className='rounded-4 mb-2 p-2 position-relative'
    >
      <Avatar
        src={hit?.profile_pic || profile_pic}
        alt={`${fullname}`}
        sx={{ width: 50, height: 50, marginRight: 2 }}
        className='me-3 ms-2'
      />
      <div className='d-flex justify-content-between flex-grow-1 align-items-center'>
          <CardContent sx={{ padding: '0 !important' }}>
            <Typography  sx={{ fontWeight: 'bold' , fontSize:'20px' }}>
            {!history ? (
              <span className="d-flex gap-2">
                <Highlight
                  attribute="firstname"
                  hit={hit}
                />
                    <Highlight
                  attribute="lastname"
                  hit={hit}
                />
              </span>
            ) : (
              fullname
            )}
            </Typography>
            <Typography color="grey.400" sx={{ fontWeight: 'bold' , fontSize:'15px' }}>
              @         {!history ? (
              <Highlight
                attribute="username"
                hit={hit}
              />
            ) : (
              username
            )}
            </Typography>
          </CardContent>
          <CustomTooltip title="Go to Profile" placement="top">
            <span
              style={{ cursor: "pointer" }}
              className="mb-1 me-4"
              onClick={() => {
                navigateToProfile(username);
              }}
            >
              <MdOutlineOpenInNew style={{ fontSize: "23px" }} />
            </span>
          </CustomTooltip>
      </div>

      {history && (
        <CustomTooltip title="Remove from history" placement="top">
          <span
            className="position-absolute end-0 top-0  p-0 me-1"
            onClick={() => {
              deleteFromHistory(id);
            }}
          >
            <CloseIcon style={{ fontSize: "18px", cursor: "pointer" }} />
          </span>
        </CustomTooltip>
      )}
    </Card>
  );
}

export default UserSearchResult;
