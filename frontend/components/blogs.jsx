import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { authContext } from "../context/authContext";
// import "./home.css";
const Blogs = () => {
  // const [posts, setPosts] = useState([]);
  const { posts, setPosts, filteredPosts } = useContext(authContext);
  const backendUrl = "https://blog-3-mfgj.onrender.com";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const cat = location.search;
  console.log(cat);
  const sliced = cat.slice(1);
  console.log(sliced);

  useEffect(() => {
    if (cat) {
      setLoading(true);
      const getPosts = async () => {
        try {
          let res;
          if (sliced != "home") {
            res = await axios.get(`${backendUrl}/cat${cat}`);
            if (JSON.stringify(res.data) !== JSON.stringify(posts)) {
              setPosts(res.data);
            }
            //  return setPosts(res.data);
          } else {
            res = await axios.get(`${backendUrl}/cat/?cat=${sliced}`);
            console.log(res);
            if (JSON.stringify(res.data) !== JSON.stringify(posts)) {
              setPosts(res.data); // Only update if the posts have changed
            }
            // return setPosts(res.data);
          }
        } catch (err) {
          console.error("Error fetching posts:", err);
        } finally {
          setLoading(false);
        }
      };
      getPosts();
    }
  }, [cat, posts]);
  console.log(posts);
  // useEffect(() => {
  //    setLoading(true)
  //   console.log(loading + "started")
  //   if (posts != 0) setLoading(false);
  //   console.log("loading ...")
  //   if (posts.length == 0) {
  //     setLoading(false);
  //   }
  // }, [posts, cat , loading]);

  // console.log(posts);
  // const searchParams = new URLSearchParams(location.search);
  // const category = searchParams.get("cat");

  return (
    <>
      <nav className="nav2">
        <Link to="/blog?cat=All" className="navbar-link">
          All
        </Link>
        <Link to="/blog?cat=art" className="navbar-link">
          Art
        </Link>
        <Link to="/blog?cat=science" className="navbar-link">
          Science
        </Link>
        <Link to="/blog?cat=technology" className="navbar-link">
          Technology
        </Link>
        <Link to="/blog?cat=cinema" className="navbar-link">
          Cinema
        </Link>
        <Link to="/blog?cat=design" className="navbar-link">
          Design
        </Link>
        <Link to="/blog?cat=food" className="navbar-link">
          Food
        </Link>
      </nav>
      {loading ? (
        <h2 className="text-center my-[32px] text-xl font-semibold">
          Loading...
        </h2>
      ) : posts.length === 0 ? (
        <h2 className="text-center my-[32px] text-xl font-semibold">
          No posts
        </h2>
      ) : (
        <div className="posts-container">
          <div className="innerContainer">
            {filteredPosts.map((post, index) => (
              <div
                className={`post ${index % 2 === 0 ? "left" : "right"}`}
                key={post.id}
              >
                <img src={`${backendUrl}/upload/${post.img}`} alt="t image" />
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.desc}</p>
                  <Link
                    className="post-link"
                    to={`/blog/cat=${post.cat}/post/${post.id}`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
