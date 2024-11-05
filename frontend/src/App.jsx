import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/auth/Home/HomePage";
import LoginPage from "./Pages/auth/Login/LoginPage";
import SignUpPage from "./Pages/auth/SignUp/SignUpPage";
import NotificationPage from "./Pages/notification/NotificationPage";
import ProfilePage from "./Pages/profile/ProfilePage";

import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/notifications" element={<NotificationPage/>}/>
          <Route path="/profile/:username" element={<ProfilePage/>} />
        </Routes>
      <RightPanel/>
    </div>
  );
}

export default App;
