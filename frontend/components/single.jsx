import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import moment from "moment";
import { authContext } from "../context/authContext";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Cookies from "js-cookie";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Menu from "../pages/Menu";
// import "./home.css"
export const Single = () => {
  const [post, setPost] = useState([]);
  // const [format, setformat] = useState();
  const { user ,backendUrl} = useContext(authContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const url = useParams();
  // console.log(user);
  // console.log(url.id);
  const ID = url.id;

  const fetch = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/cat/getPost${ID}`,
        {
          params: { ID },
        }
      );
      setPost(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
  }, [ID]);
  // console.log(post);
  // console.log(user);

  const navigate = useNavigate();
  // useEffect(() => {
  const handleDelete = async () => {
    console.log("rur");
    setShowPopup(false);
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
        `${backendUrl}/cat/deletePost/${ID}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("Post deleted successfully");
        // alert(res.data); // Display success message
        setPost([]); // Clear the post (if needed)
        navigate("/home");
      } else {
        console.log("Unexpected response:", res);
        alert("Failed to delete the post.");
      }
    } catch (err) {
      console.log("cannot delete others post");
      console.error(err);
    }
  };

  return (
    <>
      {post.length == 0 ? (
        <div>loading</div>
      ) : (
        <>
          {showPopup && (
            <div className="overlaypop">
              <div className="popup">
                <p>{popupMessage}</p>
                <button className="" onClick={handleDelete}>
                  delete
                </button>
              </div>
            </div>
          )}
          <div className="single">
            <div className="content">
              <div className="imgbox">
                <img
                  src={`/upload/${encodeURIComponent(post[0]?.postImg)}`}
                  alt="Post Image"
                />
              </div>
              <div className="box2">
                <div className="user">
                  <div className="info">
                    <span>UserName : {post[0]?.username}</span>
                    <p>Posted {moment(post[0]?.date).fromNow()}</p>
                  </div>
                  {user?.USERNAME === post[0]?.username && (
                    <div className="edit">
                      {/* {console.log(post[0]?.date)} */}
                      <Link to={`/write?edit=${post[0].id}`} state={post}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <FontAwesomeIcon
                        className="delete"
                        onClick={() => {
                          setShowPopup(true);
                          setPopupMessage("Sure you want to delete this post?");
                        }}
                        icon={faTrash}
                      />
                    </div>
                  )}
                </div>
                <p>
                  <span className="status">Status : </span> {post[0].status}{" "}
                </p>
                <h1>
                  {" "}
                  <span className="status"> Title : </span>
                  {post[0]?.title}
                </h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post[0]?.desc),
                  }}
                ></p>
              </div>
            </div>
            <Menu cat={post[0]?.cat} />
          </div>
        </>
      )}
    </>
    // <div>hello world</div>
  );
};
