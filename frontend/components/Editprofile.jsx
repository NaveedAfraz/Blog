import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/authContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { setUser, user, backendUrl } = useContext(authContext);
  const [editUsername, seteditUsername] = useState(user?.USERNAME || "");
  const [editEmail, seteditEmail] = useState(user?.EMAIL || "");

  const [postDetails, setPostDetails] = useState({
    file: user?.userimg
      ? { name: user?.userimg, isUploaded: true, fileObject: null }
      : { name: "", isUploaded: false, fileObject: null },
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => seteditUsername(e.target.value);
  const handleEmailChange = (e) => seteditEmail(e.target.value);
  console.log(postDetails);
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPostDetails((prevState) => ({
        ...prevState,
        file: {
          name: selectedFile.name,
          isUploaded: false,
          fileObject: selectedFile,
        },
      }));
    }
  };

  const upload = async (e) => {
    // e.preventDefault();
    try {
      if (postDetails.file?.isUploaded) {
        console.log("Using existing image:", postDetails.file.name);
        return postDetails.file.name;
      }

      const selectedFile = postDetails.file?.fileObject;
      if (!(selectedFile instanceof File)) {
        console.error("Invalid file format or no file selected");
        return null;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(`${backendUrl}/uploaduserimg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error during file upload:", err);
    }
  };

  const handleSave = async (e) => {
    // e.preventDefault();
    let imgUrl;

    if (postDetails.file?.isUploaded) {
      imgUrl = postDetails.file.name;
    } else if (postDetails.file?.fileObject) {
      imgUrl = await upload();
      console.log("Uploaded image:", imgUrl);
    } else {
      imgUrl = null;
    }

    const data = {
      username: editUsername,
      email: editEmail,
      image: imgUrl,
    };
    console.log("Data to send", data);
  //  setUser(data);
    try {
      const res = await axios.put(
        `${backendUrl}/user/userBlog/${user.ID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data?.user);
      if (res.data.status === 200) {
        setUser(res.data?.user);
        // console.log(
        //   "Setting popup message:",
        //   "The details were updated, redirecting to HomePage..."
        // );
        // setPopupMessage("The details were updated, redirecting to HomePage...");

        // // Show the popup
        // console.log("Setting showPopup to true");
        // setShowPopup(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  console.log(showPopup);
  useEffect(() => {
    if (showPopup) {
      console.log("Popup is visible:", popupMessage);
      if (showPopup) {
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    }
  }, [showPopup]);

  return (
    <>
      {showPopup && (
        <div className="overlaypop">
          <div className="popup">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h2 className="edit-profile-heading">Edit Profile</h2>
          <form className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="profile-image">Profile Picture</label>
              <input
                type="file"
                id="profile-image"
                name="profile-image"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={editUsername}
                name="username"
                placeholder="John Doe"
                onChange={handleUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={editEmail}
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                onChange={handleEmailChange}
              />
            </div>
            <div className="edit-profile-actions">
              <button
                onClick={() => {
                  setShowPopup(true);
                  setPopupMessage(
                    "The details were updated, redirecting to HomePage..."
                  ); // Show the popup
                  
                  handleSave(); // Call the handleSave function
                }}
                type="button" // Change type to 'button' to prevent form submission
                className="save-button"
              >
                Save Changes
              </button>

              <Link type="button" className="cancel-button" to="/profile">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
