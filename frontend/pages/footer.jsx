import React from "react";
import logo from "../components/img/logo.png";

export const Foot = () => {
  return (
    <div className="page-wrapper">
      {/* Main content area */}
      <div className="content">
        {/* Your page content goes here */}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Logo */}
          <img src={logo} alt="Logo" className="footer-logo" />

          {/* Text */}
          <span className="footer-text sh">
            Made with <span className="footer-heart">❤️</span> <b>React.js</b>
          </span>
        </div>
      </footer>
    </div>
  );
};
