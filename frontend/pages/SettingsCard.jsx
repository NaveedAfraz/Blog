import React, { useState, useContext, useEffect } from "react";
import { authContext } from "../context/authContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./userposts.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Cookies from "js-cookie";
import { faEdit, faRunning, faTrash } from "@fortawesome/free-solid-svg-icons";
import Menu from "../pages/Menu";
const Tabs = () => {
  const { user, setuser, filteredPosts, setPosts, posts ,backendUrl} =
    useContext(authContext);
  // console.log(user);

  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    console.log("running");
    const fetchpostsAgain = async () => {
      try {
        const res = await axios.get(`${backendUrl}/cat/?cat=All`);
        console.log(res);
        // if (JSON.stringify(res.data) !== JSON.stringify(posts)) {
        setFiltered(res.data); // Only update if the posts have changed
        // }
        console.log(filtered);
        console.log("running2");
      } catch (error) {
        console.log(error);
      }
    };
    fetchpostsAgain();
  }, [filteredPosts]);

  const [newDetails, setNewDetails] = useState({});
  const [activeTab, setActiveTab] = useState("account");
  const [userPosts, setuserposts] = useState([]);
  const [isEditing, setEditing] = useState("noedit");
  // const [newEmail, setnewEmail] = useState(user?.EMAIL);

  // const draftfiltered = filteredPosts.filter(
  //   (userDraft) => userDraft.id !== user.ID
  // );

  // console.log(draftfiltered);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetails((prevdetails) => ({
      ...prevdetails,
      [name]: value,
    }));
  };
  // console.log(newDetails);

  // const spilit = newDetails.Dob.slice(0,10)
  // console.log(spilit)

  // useEffect(() => {
  //   setNewDetails({
  //     FIRSTNAME: user?.FIRSTNAME || "",
  //     LASTNAME: user?.LASTNAME || "",
  //     DOB: user?.DOB || "",
  //     BIO: user?.BIO || "",
  //     PHONE: user?.PHONE || "",
  //   });
  //   console.log("updatinf useeffect");
  // }, []);
  // const {} = useContext(authContext);
  // console.log(user);
  const navigate = useNavigate();
  const tabs = ["account", "posts", "comments", "drafts"];
  // const id = user.ID;
  useEffect(() => {
    // console.log(user.ID);
    const getPosts = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/user/userBlog/${user.ID}`
        );
        const posts = res.data.filter((post) => post.status === "published");
        console.log(res.data);
        setuserposts(posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    getPosts();
  }, [user?.ID]);
  // console.log(userPosts);
  const handlechnagetabs = (tab) => {
    console.log(newDetails);
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  }; //console.log(newd

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditing("edit");
    // formatDate(newDetails)
    console.log("runninggggg");
    // console.log(newDetails);
    // finally {
    //   // console.log(newDetails.json());
    //   setEditing(false);
    // }
    // setEditing(false);
    // console.log(newDetails);
  };
  console.log(user?.ID);
  //console.log(isEditing);
  // console.log(newDetails);
  const reload = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/user/details/${user.ID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedUser = await res.json();

      //  console.log(updatedUser);
      // setNewDetails(updatedUser.updatedUser);
      const formattedDob = updatedUser.updatedUser.Dob.split("T")[0];
      setNewDetails({
        ...updatedUser.updatedUser,
        Dob: formattedDob,
      });
      // console.log(newDetails);
      console.log("running2");
    } catch (error) {
      console.error("Error fetching updated details:", error);
    }
  };
  useEffect(() => {
    reload();
    console.log(newDetails);
  }, []);
  const handleSave = async () => {
    setEditing("noedit");
    const formattedDetails = {
      ...newDetails,
      Dob: newDetails.Dob ? newDetails.Dob.split("T")[0] : null,
    };
    console.log(formattedDetails);
    try {
      const res = await fetch(
        `${backendUrl}/user/updateDetails/${user.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedDetails),
        }
      );

      //setEditing(false);
      // setEditing(false);
      const updatedUser = await res.json();
      // setEditing(false);
      console.log(res);

      console.log(updatedUser.updatedUser);
      // setNewDetails(updatedUser.updatedUser)
      const formattedDob = updatedUser.updatedUser.Dob.split("T")[0];
      setNewDetails({
        ...updatedUser.updatedUser,
        Dob: formattedDob,
      });
      console.log("hlo");
      await reload();
      console.log(newDetails);
      setEditing("noedit");
    } catch (error) {
      console.log(error);
    }
    // setNewDetails(user);
  };
  console.log(newDetails);
  // useEffect(() => {
  //   //   console.log("running");
  //   if (isEditing === "noedit") {
  //     reload();
  //   }
  // }, [isEditing]);

  const formatDate = (timestamp) => {
    // Ensure to format date as YYYY-MM-DD, stripping out the time
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };
  const handleDelete = async (postid) => {
    try {
      // const token = Cookies.get("access_token");
      // // or from cookies
      // console.log(token);
      // if (token) {
      //   console.log("Token found:", token);
      // } else {
      //   console.log("Token not found");
      // }
      const res = await axios.delete(
        `${backendUrl}/cat/deletePost/${postid}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("Post deleted successfully");
        // alert(res.data); // Display success message
        // setPost([]); // Clear the post (if needed)
        setfilteredPostsagain((prevFiltered) =>
          prevFiltered.filter((post) => post.id !== postid)
        );

        console.log(res.data);
        // navigate("/?home");
      } else {
        console.log("Unexpected response:", res);
        alert("Failed to delete the post.");
      }
    } catch (err) {
      console.log("cannot delete others post");
      console.error(err);
    }
  };
  console.log(filtered);
  const [filteredPostsagain, setfilteredPostsagain] = useState([]);
  useEffect(() => {
    console.log("faRunning");
    const filteredPostsagain = filtered.filter(
      (post) => post.status == "draft"
    );
    console.log(filteredPostsagain);
    setfilteredPostsagain(filteredPostsagain);
  }, [filtered]);
  console.log(filteredPostsagain);
  return (
    <div className="tabs">
      {/* Tab Headers */}
      <div className="tabHeaders">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handlechnagetabs(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tabContent">
        {activeTab === "account" && (
          <form className="form">
            <div className="row">
              <label>First Name</label>
              <input
                type="text"
                name="FirstName"
                value={newDetails?.FirstName}
                onChange={handleInputChange}
                readOnly={isEditing == "noedit"}
              />
            </div>
            <div className="row">
              <label>Last Name</label>
              <input
                type="text"
                name="LastName"
                value={newDetails?.LastName}
                onChange={handleInputChange}
                readOnly={isEditing == "noedit"}
              />
            </div>
            <div className="row">
              <label>Date of Birth</label>
              <input
                type="date"
                name="Dob"
                value={formatDate(newDetails.Dob)}
                onChange={handleInputChange}
                readOnly={isEditing == "noedit"}
              />
            </div>
            <div className="row">
              <label>Bio</label>
              <textarea
                name="Bio"
                value={newDetails?.Bio}
                onChange={handleInputChange}
                readOnly={isEditing == "noedit"}
              ></textarea>
            </div>
            <div className="row">
              <label>Email Address</label>
              <input
                type="email"
                name="EMAIL"
                value={user?.EMAIL || ""}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="row">
              <label>Phone Number</label>
              <input
                type="text"
                name="PhoneNo"
                value={newDetails?.PhoneNo}
                onChange={handleInputChange}
                readOnly={isEditing == "noedit"}
              />
            </div>
            {isEditing == "noedit" && (
              <button className="editdetails" onClick={handleEdit}>
                Edit Details
              </button>
            )}
            {isEditing == "edit" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                save details
              </button>
            )}
          </form>
        )}

        {activeTab === "posts" && (
          <div className="user-posts-container">
            <h3>Your Blog Posts</h3>
            <ul>
              {user && userPosts.length > 0 ? (
                <div className="user-posts ">
                  <div className="user-innerContainer">
                    {userPosts.map((post, index) => (
                      <div
                        className={`post-item ${
                          index % 2 === 0 ? "left" : "right"
                        }`}
                        key={post.id}
                      >
                        <img src={`/upload/${post.img}`} alt="post image" />
                        <div className="post-content">
                          <h2>{post.title}</h2>
                          <p>{post.desc}</p>
                          <Link
                            className="post-link"
                            to={`/cat=${post.cat}/post/${post.id}`}
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No posts available.</p>
              )}
            </ul>
          </div>
        )}
        {/* {console.log(user)} */}
        {activeTab === "comments" && (
          <div className="comments">
            <h3>Your Comments</h3>
            <ul>
              {user?.COMMENTS && user.COMMENTS.length > 0 ? (
                user.COMMENTS.map((comment, index) => (
                  <li key={index}>
                    <p>{comment.text}</p>
                    <small>On: {comment.postTitle}</small>
                  </li>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </ul>
          </div>
        )}
        {activeTab === "drafts" && (
          <div className="user-posts-container">
            <h3>Drafts</h3>
            <ul>
              {user && userPosts.length > 0 ? (
                <div className="user-posts">
                  <div className="user-innerContainer">
                    {filteredPostsagain.length !== 0 &&
                      filteredPostsagain.map((post, index) => (
                        <div
                          className={`post-item ${
                            index % 2 === 0 ? "left" : "right"
                          }`}
                          key={post.id}
                        >
                          <img src={`/upload/${post.img}`} alt="post image" />
                          <div className="post-content">
                            <h2>{post.title}</h2>
                            <p>{post.desc}</p>
                            <Link
                              className="post-link"
                              to={`/cat=${post.cat}/post/${post.id}`}
                            >
                              Read More
                            </Link>
                            <div className="edit">
                              {console.log(post.id)}
                              <Link
                                to={`/write?edit=post/${post.id}`}
                                state={[post]}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Link>
                              <FontAwesomeIcon
                                className="delete"
                                onClick={() => handleDelete(post.id)}
                                icon={faTrash}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p>No posts available.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
