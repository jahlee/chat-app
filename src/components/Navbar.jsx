import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";
import { auth } from "../firebase-config";
import "../styling/Navbar.css";

/**
 * Navbar that links to other pages
 */
function Navbar() {
  const { isAuth } = useContext(UserContext);
  const location = useLocation();

  const logOut = () => {
    signOut(auth);
  };

  return (
    <nav className="nav">
      {!isAuth ? (
        <React.Fragment>
          <div className="nav-left">
            <NavLink className="navbar-title" to="/" aria-label="Home">
              ChatApp
            </NavLink>
          </div>
          <div className="nav-right">
            <NavLink className="navbar-link" to="login" aria-label="Login">
              Login
            </NavLink>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {location.pathname === "/profile" && (
            <div className="nav-left">
              <NavLink className="navbar-link" to="chats" aria-label="Chats">
                <span className="navbar-back">&lt;</span>
              </NavLink>
            </div>
          )}
          {location.pathname !== "/profile" && (
            <React.Fragment>
              <div className="nav-left">
                <NavLink className="navbar-title" to="/chats" aria-label="Home">
                  ChatApp
                </NavLink>
              </div>
              <div className="nav-right">
                <NavLink
                  className="navbar-link"
                  to="profile"
                  aria-label="Profile"
                >
                  Profile
                </NavLink>
                <NavLink
                  className="navbar-link"
                  to="#"
                  onClick={logOut}
                  aria-label="Log Out"
                >
                  Log Out
                </NavLink>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </nav>
  );
}

export default Navbar;
