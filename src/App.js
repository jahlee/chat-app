import "./styling/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes className="page-content">
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/chats" element={<Chats />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
