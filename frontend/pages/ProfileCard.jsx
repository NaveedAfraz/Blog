import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../context/authContext";
import axios from "axios";

const ProfileCard = () => {
  const { user, seteditshow, setUser, setloggedIn, backendUrl } =
    useContext(authContext);

  const handleEdit = () => {
    seteditshow(true);
  };
  useEffect(() => {
    console.log("authCheck");
    if (user) {
      return; // Do nothing if user is already set
    }
    const authCheck = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth/authCheck`, {
          withCredentials: true, // it sends the cookie to backend
        }); 
        console.log("authCheck2");
        // console.log(res);
        console.log(res.data.data[0]);
        setUser(res.data.data[0]); // Restore user details
        setloggedIn(true);
      } catch (err) {
        console.log("Session expired or invalid", err);
        setUser(null);
        setloggedIn(false);
        if (!localStorage.getItem("user")) {
          setUser(null);
          setloggedIn(false);
        }
      }
    };

    authCheck();
  }, []);
  // Dynamically generate the image URL
  const imageUrl = user?.userimg
    ? `${backendUrl}/uploaduserimg/${encodeURIComponent(user?.userimg)}`
    : "https://via.placeholder.com/150";
  // console.log(imageUrl);
  // console.log(user.userimg)
  // console.log("Image URL:", imageUrl);
  console.log("User Image:", user?.userimg);
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Halfway Image */}
        <div className="profile-image-container">
          <img src={imageUrl} alt="Profinle" className="profile-image" />
        </div>

        {/* Content */}
        <div className="profile-content">
          <h3 className="profile-name">{user?.USERNAME || "John Doe"}</h3>
          <p className="profile-role">{user?.EMAIL || "CEO of Apple"}</p>
          <ul className="profile-details">
            <li>
              <strong>Username:</strong> {user?.USERNAME || "johndoe"}
            </li>
            <li>
              <strong>Email:</strong> {user?.EMAIL || "johndoe@example.com"}
            </li>
            {/* <li>
              <strong>Date of Birth:</strong> {user?.DOB || "1990-01-01"}
            </li> */}
          </ul>
          <Link
            className="edit-button"
            to="/profile?edit=true"
            onClick={handleEdit}
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
