import Header from "../components/parts/Header";
import MainPage from "../pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SavedPage from "../pages/SavedPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationBell from "../components/parts/NotificationsBell";


function App()
{
return (
    <div>
       <Router>
      <div>
        <NotificationBell/>
        <Header/>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/local" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>

    </div>
)}



export default App;