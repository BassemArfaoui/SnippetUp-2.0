import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/parts/Header";
import MainPage from "../pages/MainPage";
import SavedPage from "../pages/SavedPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationBell from "../components/parts/NotificationsBell";
import CustomToaster from "../components/tools/CustomToaster";

function App() {
  
  return (
    <Router>
        <CustomToaster />
        <NotificationBell />
        <Header />
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    </Router>

  );
}

export default App;
