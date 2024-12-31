import axios from "axios";

import { createContext, useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";

export const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  //  JSON.parse(localStorage.getItem("user"))
  const backendUrl = "https://blog-2-gxa8.onrender.com";
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [editshow, seteditshow] = useState(false);
  // console.log(user);
  const filteredPosts = posts.filter((post) => post.status == "published");
  console.log(filteredPosts);
  const [loggedIn, setloggedIn] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  // console.log(user.temp_token);
  const [error, seterror] = useState("");
  console.log(user);
  // useEffect(() => {
  const login = async (inputs) => {
    // console.log(inputs);
    try {
      const send = await axios.post(
        "http://localhost:3006/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );
      console.log(send);
      console.log("data sended context");
      if (send.status === 200) {
        // navigate("/home");
        console.log(send);
        setUser(send.data);
        seterror("");
        setloggedIn(true);
      }
      // console.log(send.data);
    } catch (error) {
      seterror("invaild");
      alert("Something went wrong with the login process.");
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    }
    // console.log(inputs);
    console.log("hlo");
  };

  // }, []);
  useEffect(() => {
    console.log("authCheck");
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

  useEffect(() => {
    console.log(user);
    //if (!user) {
    // localStorage.setItem("user", JSON.stringify(user));
    //}
    console.log("refreshed");
  }, [user]);

  const logout = async () => {
    const send = await axios.post(
      `${backendUrl}/auth/logout`,
      { email: user.EMAIL, token: user.temp_token },
      {
        withCredentials: true,
      }
    );
    setUser(null);
    // console.log(send);
    setloggedIn(false);
    //  localStorage.removeItem("user");
    //  console.log(send.data);
  };

  return (
    <>
      <authContext.Provider
        value={{
          user,
          setUser,
          posts,
          filteredPosts,
          setPosts,
          login,
          logout,
          loggedIn,
          setloggedIn,
          error,
          seterror,
          editshow,
          seteditshow,
        }}
      >
        {children}
      </authContext.Provider>
    </>
  );
};
