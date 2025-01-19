import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Post from "../parts/Post";
import SharedPosts from "./SharedPosts";
import MoreInfos from "./MoreInfos";

function ProfileBody({activeTab , setActiveTab , containerRef}) {

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="profile-body py-3 pt-2 pt-0 px-1 mt-0 d-flex flex-column gap-3">
      {/* Menu with Material-UI Tabs */}
 
      {/* Tab Content */}
      {activeTab === 'Posts' && (
        <SharedPosts containerRef={containerRef} />
      )}
      {activeTab === 'Infos' && (
        <MoreInfos />
      )}
      {activeTab === 'More' && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          This is the Something Else section. Customize it as needed.
        </Typography>
      )}
    </div>
  );
}

export default ProfileBody;
