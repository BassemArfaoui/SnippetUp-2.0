import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/parts/Header";
import NotificationBell from "../components/parts/NotificationsBell";
import CustomToaster from "../components/tools/CustomToaster";
import Spinner from "../components/tools/Spinner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Correct 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoadingSpinner from "../components/tools/LoadingSpinner";
import TestPage from "../components/test/TestPage";

// Lazy-load the components
const MainPage = lazy(() => import("../pages/MainPage"));
const SavedPage = lazy(() => import("../pages/SavedPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const SavedPostsCollections = lazy (()=> import("../components/saved/saved-posts/SavedPostsCollections"))
const CollectionPosts = lazy (()=> import("../components/saved/saved-posts/CollectionPosts"))
const PostPage = lazy (()=> import("../pages/PostPage"))
const DemandsPage = lazy (()=> import("../pages/DemandsPage"))


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <CustomToaster />
        <NotificationBell />
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/demands" element={<DemandsPage />} />
            <Route path="/saved/posts/collections" element={<SavedPostsCollections />} />
            <Route path="/saved/posts/collection/:collection" element={<CollectionPosts/>} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
