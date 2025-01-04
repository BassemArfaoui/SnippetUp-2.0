import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Post from "../parts/Post";
import SharedPosts from "./SharedPosts";
import MoreInfos from "./MoreInfos";

function ProfileBody() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="profile-body py-3 pt-2 pt-0 px-4 mt-1 d-flex flex-column gap-3">
      {/* Menu with Material-UI Tabs */}
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          variant="fullWidth"
          onChange={handleTabChange}
          centered
          textColor="inherit" 
          TabIndicatorProps={{
            style: { backgroundColor: "#0d6efd" }, 
          }}
        >
          <Tab
            label="Shared Posts"
            className="fw-bold"
            sx={{
              color: activeTab === 0 ? "#0d6efd" : "#6c757d", 
              "&.Mui-selected": {
                color: "#0d6efd", 
              },
              fontSize :'18px'
            }}
          />
          <Tab
            label="More Info"
            className="fw-bold"
            sx={{
              color: activeTab === 1 ? "#0d6efd" : "#6c757d",
              "&.Mui-selected": {
                color: "#0d6efd",
              },
              fontSize :'18px',
            }}
          />
          <Tab
            label="Something Else"
            className="fw-bold"
            sx={{
              color: activeTab === 2 ? "#0d6efd" : "#6c757d",
              "&.Mui-selected": {
                color: "#0d6efd",
              },
              fontSize :'18px'
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <SharedPosts />
      )}
      {activeTab === 1 && (
        <MoreInfos />
      )}
      {activeTab === 2 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          This is the Something Else section. Customize it as needed.
        </Typography>
      )}
    </div>
  );
}

export default ProfileBody;
