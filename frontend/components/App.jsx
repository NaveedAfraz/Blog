import { useContext, useState } from "react";
import "./login.css";
// import "font-awesome/css/font-awesome.min.css";
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
import { Analytics } from "@vercel/analytics/react"
function App() {
  const Layout = () => {
    return (
      <>
        {/* // <div className="app-wrapper"> */}
        <Navbar />{" "}
        <div className="main-content">
          <Outlet />
        </div>{" "}
        <Foot />{" "}
      </>
      // </div>
    );
  };
  const { editshow, seteditshow } = useContext(authContext);
  // console.log(editshow);
  const NotFound = () => {
    return (
      <div>
        <h1>404 Not Found</h1>
      </div>
    );
  };
  const [showpopup, setshowpopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  return (
    <>
      <Analytics />
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
              path="/profile"
              element={
                editshow ? (
                  <EditProfile
                    showpopup={showpopup}
                    setshowpopup={setshowpopup}
                    popupMessage={popupMessage}
                    setPopupMessage={setPopupMessage}
                  />
                ) : (
                  <UserProfile />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/write" element={<Write />}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
