import "./styling/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const logOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      // cannot use react-router-dom library outsive of router
      window.location.pathname = "/login"; // alternative to useNavigate hook
    });
  };
  return (
    <UserProvider>
      <ChatProvider>
        <Router>
          <div className="App">
            <Navbar isAuth={isAuth} logOut={logOut} />
            <Routes className="page-content">
              <Route path="/" element={<Home isAuth={isAuth} />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/chats" element={<Chats />}></Route>
              <Route
                path="/login"
                element={<Login setIsAuth={setIsAuth} />}
              ></Route>
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
