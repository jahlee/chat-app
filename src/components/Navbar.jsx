import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styling/Navbar.css";

function Navbar(props) {
  const { isAuth, logOut } = props;
  const location = useLocation();

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
          {location.pathname === "/chats" && (
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
                onClick={() => logOut()}
                aria-label="Log Out"
              >
                Log Out
              </NavLink>
            </div>
          )}
        </React.Fragment>
      )}
    </nav>
  );
}

export default Navbar;
