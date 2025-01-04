import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../components/img/logo.png"; // Update this path to where your logo image is stored
import { authContext } from "../context/authContext";
// import { faL } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ children }) => {
  const { user, logout, seteditshow } = useContext(authContext);
  const [dropdownActive, setDropdownActive] = useState(false);

  const toggleDropdown = () => {
    setDropdownActive((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          ☰
        </button>
        <div
          className={`navbar-links ${
            dropdownActive ? "dropdown-links-active" : ""
          }`}
        >
          <Link
            to="/home"
            className="navbar-link"
            onClick={() => setDropdownActive((prev) => !prev)}
          >
            Home
          </Link>
          <Link
            to="/blog?cat=All"
            className="navbar-link"
            onClick={() => setDropdownActive((prev) => !prev)}
          >
            blogs
          </Link>
          {user && (
            <Link
              onClick={() => {
                seteditshow(false);
                setDropdownActive((prev) => !prev);
              }}
              to="/profile/?tab=account"
              className="navbar-user"
            >
              {user?.USERNAME}
            </Link>
          )}
          {user?.USERNAME ? (
            <button
              onClick={() => {
                setDropdownActive((prev) => !prev);
                logout;
              }}
              className="navbar-button"
            >
              LogOut
            </button>
          ) : (
            <Link
              to="/login"
              className="navbar-link"
              onClick={() => setDropdownActive((prev) => !prev)}
            >
              Login
            </Link>
          )}
          <Link
            to="/write"
            className="navbar-write-link"
            onClick={() => setDropdownActive((prev) => !prev)}
          >
            Write
          </Link>
        </div>
      </nav>
      <div className={`content ${dropdownActive ? "dropdown-active" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default Navbar;
