import React, { lazy, Suspense , useEffect , useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/parts/Header";
import NotificationBell from "../components/parts/NotificationsBell";
import CustomToaster from "../components/tools/CustomToaster";
import userContext from '../components/contexts/userContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Correct 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoadingSpinner from "../components/tools/LoadingSpinner";
import TestPage from "../components/test/TestPage";
import ProtectedRoute from "../components/tools/ProtectedRoute";
import NotAuthRoute from "../components/tools/NoAuthRoute";



// Lazy-load the components
const MainPage = lazy(() => import("../pages/MainPage"));
const SavedPage = lazy(() => import("../pages/SavedPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const SavedPostsCollections = lazy (()=> import("../components/saved/saved-posts/SavedPostsCollections"))
const CollectionPosts = lazy (()=> import("../components/saved/saved-posts/CollectionPosts"))
const PostPage = lazy (()=> import("../pages/PostPage"))
const DemandsPage = lazy (()=> import("../pages/DemandsPage"))
const AuthPage = lazy (()=> import("../pages/AuthPage"))
const SearchPage = lazy (()=> import("../pages/SearchPage"))



const queryClient = new QueryClient();

function App() {

  const [forceRefetch ,  setForceRefetch] = useState(false)
  const [user,setUser]=useState({id:0,username:'',email:''});

useEffect(()=>{
  const storedData=localStorage.getItem('token');
  if(storedData){
    setUser(JSON.parse(storedData).user);
  }
},[])
  return (
    <userContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <CustomToaster />
          <NotificationBell />
         <Header />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
              <Route path="/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/demands" element={<ProtectedRoute><DemandsPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route
                path="/saved/posts/collections"
                element={<ProtectedRoute><SavedPostsCollections /></ProtectedRoute>}
              />
              <Route
                path="/saved/posts/collection/:collection"
                element={<ProtectedRoute><CollectionPosts /></ProtectedRoute>}
              />
              <Route path="/test" element={<TestPage />} />
              <Route path="/login" element={<NotAuthRoute><AuthPage /></NotAuthRoute>} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </userContext.Provider>
  );
}

export default App;
