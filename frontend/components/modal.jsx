import React, { useState } from "react";
import { Link } from "react-router-dom";

const Modal = ({ showText, setshowModal, showModal, setShowtext }) => {
  if (!showModal) return null;

  // const hasUndefined = Object.values(details).includes(undefined);
  // if (hasUndefined) {
  //   setshowModal(true);
  // }
  const closeModal = () => {
    // setIsModalOpen(false);
    setshowModal(false);
  };
  // console.log(hasUndefined);
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>

          <div className="modal-body">
            <h2>You cannot write a blog without logging in!</h2>
            <p>Please log in to start writing your blog.</p>
            <Link className="login-btn" to="/login">
              Login
            </Link>
            <Link className="login-btn" to="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
