import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RegistrationForm from "./auth/Registration";
import UserListing from "./components/UserListing";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Conversation from "./components/Conversation";
import Login from "./components/Login";
import SelectedUsers from "./components/SelectedUsers";
import Navbar from "./components/Navbar";
import Setting from "./components/Setting";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userList" element={<UserListing />} />
          <Route path="/selected-users" element={<SelectedUsers />} />
          <Route path="/settings" element={<Setting />} />
          <Route
            path="/selected-users/conversation/:id"
            element={<Conversation />}
          />
        </Routes>
        {/* selected-users */}
      </BrowserRouter>
    </>
  );
}

export default App;
