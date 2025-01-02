import React, { useContext } from "react";
import { use } from "react";
import { authContext } from "../context/authContext";
import { Link } from "react-router-dom";
import ProfileCard from "../pages/ProfileCard";
import Tabs from "../pages/SettingsCard";
// import "./UserProfile.scss";

const UserProfile = () => {
  //const { user } = useContext(authContext);
  const { editshow, user } = useContext(authContext);
  // const handleEdit = () => {
  //   seteditshow(true);
  // };
  // console.log(user.userimg);
  // console.log(user)
  // console.log(`/upload/${user.userimg}`);
  console.log(user);
  // const imageUrl = user?.userimg
  //   ? `http://${backendurl}:3006/uploaduserimg/${user.userimg}`
  //   : null;

  const unsplashImageUrl =
    "https://images.unsplash.com/photo-1734485836409-ba4a2f822016?q=80&w=1785&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  console.log(unsplashImageUrl);

  return (
    // <div className="profile-container">
    //   <div className="profile-card">
    //     <div className="profile-header">
    //       <img
    //         src={imageUrl} // Dynamically created URL for the profile image
    //         alt="Profile"
    //         className="profile-image"
    //       />
    //       <div className="profile-info">
    //         <h2 className="profile-username">{user.USERNAME}</h2>
    //         <p className="profile-email">{user?.EMAIL}</p>
    //       </div>
    //     </div>
    //     <div className="profile-details">
    //       <p className="profile-detail-item">
    //         <strong>Username:</strong> {user?.USERNAME}
    //       </p>
    //       <p className="profile-detail-item">
    //         <strong>Email:</strong> {user?.EMAIL}
    //       </p>
    //       <p className="profile-detail-item">
    //         <strong>Joined:</strong> May 24, 2022
    //       </p>
    //     </div>
    //     <Link
    //       className="edit-button"
    //       to="/profile?edit=true"
    //       onClick={handleEdit}
    //     >
    //       Edit Profile
    //     </Link>
    //   </div>
    // </div>

    <div className="containerprofile">
      <img className="backgroundimg" src={unsplashImageUrl} alt="Background" />
      <ProfileCard />
      <Tabs />
    </div>
  );
};

export default UserProfile;
