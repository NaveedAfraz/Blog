import { useContext, useState } from "react";
import "./login.css";
import "/font-awesome/css/font-awesome.min.css";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import SignUp from "./Signup";
import Home from "./blogs";
import { Single } from "./single";
import Navbar from "../pages/navbar";
import { Foot } from "../pages/footer";
import Write from "./write";
import "./style.scss";
import ForgotPassword from "./forgotPassword";
import UserProfile from "./profileUser";
import { authContext } from "../context/authContext";
import EditProfile from "./Editprofile";
import { HomePage } from "./HomePage";
import Blogs from "./blogs";
import "./index.css";
function App() {
  const Layout = () => {
    return (
      <>
      {/* // <div className="app-wrapper"> */}
        <Navbar />{" "}
        <div className="main-content">
          <Outlet />
        </div>{" "}
        <Foot/> </>
      // </div>
    );
  };
  const { editshow, seteditshow } = useContext(authContext);
  // console.log(editshow);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:cat/post/:id" element={<Single />} />
          <Route
            path="profile"
            element={editshow ? <EditProfile /> : <UserProfile />}
          />
          <Route path="/write" element={<Write />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
