import './styling/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './components/Login';
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
        <div className='App'>
        <nav className='nav'>
          {!isAuth ?
          <>
          <Link className="navbar-link" to="/">Home</Link>
          <Link className="navbar-link" to="login">Login</Link>
          </> : 
          <>
          <Link className="navbar-link" to="profile">Profile</Link>
          <Link className="navbar-link" to="chats">Chats</Link>
          <a className="navbar-link" onClick={() => _signOut()}>Log Out</a>
          </>}
        </nav>
        <Routes className='page-content'>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/chats" element={<Chats/>}></Route>
          <Route path="/login" element={<Login setIsAuth={setIsAuth}/>}></Route>
        </Routes>
        </div>
      </Router>
    )
  }
 

export default App;
