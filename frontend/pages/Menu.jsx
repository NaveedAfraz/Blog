import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authContext } from "../context/authContext";

export default function Menu({ cat }) {
  const { filteredPosts ,backendUrl} = useContext(authContext);
  const [posts, setPost] = useState([]);
  console.log(cat);
  console.log(filteredPosts);
  const id = useLocation().pathname.split("/").pop();
  console.log(id);
  const [isCurrentPost, setIsCurrentPost] = useState(false);
  const [filteredd, setfiltered] = useState([]);
  const [show, setshow] = useState(false);
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const fetch = async () => {
    try {
      const res = await axios.get(`${backendUrl}/cat/?cat=${cat}`);
      const publishedPosts = res.data.filter(
        (post) => post.status === "published"
      );
      setPost(publishedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch();
  }, [cat]);

  useEffect(() => {
    const found = posts.filter((post) => post.id == id);

    // setPost(filtered);
    setIsCurrentPost(found);
    if (found) setshow(found);
    console.log(found);
  }, [id]);
  return (
    <>
      {posts === "" ? (
        <div>
          <h1 className="menu-title">Other posts you may like</h1>
          <p className="loading-text"> no other post </p>
        </div>
      ) : (
        <>
          <div className="menu">
            {console.log(posts)}
            <h1 className="menu-title">Other posts you may like</h1>
            {isCurrentPost && posts.length == 1 && <p>Not other Posts</p>}
            {posts.map((post) => (
              <>
                <div key={post.id}>
                  {post.id == id ? (
                    isCurrentPost && null
                  ) : (
                    <>
                      <div className="otherpost" key={post.id}>
                        <img
                          className="post-image"
                          src={`/upload/${encodeURIComponent(post.img)}`}
                          alt="Post Image"
                        />
                        <h2 className="post-title">{post.title}</h2>
                        <Link
                          className="post-link"
                          to={`/cat=${cat}/post/${post.id}`}
                        >
                          Read More
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
}
