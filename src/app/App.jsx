import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/parts/Header";
import NotificationBell from "../components/parts/NotificationsBell";
import CustomToaster from "../components/tools/CustomToaster";
import Spinner from "../components/tools/Spinner";
import PostPage from "../pages/PostPage";

// Lazy-load the components
const MainPage = lazy(() => import("../pages/MainPage"));
const SavedPage = lazy(() => import("../pages/SavedPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

function App() {
  return (
    <Router>
      <CustomToaster />
      <NotificationBell />
      <Header />
      <Suspense fallback={<Spinner/>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
