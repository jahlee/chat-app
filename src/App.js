import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from './Login';
import Home from './pages/Home';
import Chats from './pages/Chats';
// import { Register } from './Register';



  function App() {
    return (
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="login">Login</Link>
          <Link to="chats">Chats</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/chats" element={<Chats/>}></Route>
        </Routes>
      </Router>
    )
  }
 

export default App;