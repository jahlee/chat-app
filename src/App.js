import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from './Login';
import Home from './components/Home';
import Chats from './components/Chats';
import Profile from './components/Profile';
import { useState } from "react"; 
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

  function App() {
    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));
    const _signOut = () => {
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
        // cannot use react-router-dom library outsive of router
        window.location.pathname = "/login"; // alternative to useNavigate hook
      });
    }
    return (
      <Router>
        <nav className="navbar">
          <Link to="/">Home</Link>
          {!isAuth ? 
          <Link to="login">Login</Link> : 
          <>
          <button onClick={() => _signOut()}>Log out</button>
          <Link to="profile">Profile</Link>
          <Link to="chats">Chats</Link>
          </>}
        </nav>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login setIsAuth={setIsAuth}/>}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/chats" element={<Chats/>}></Route>
        </Routes>
      </Router>
    )
  }
 

export default App;
