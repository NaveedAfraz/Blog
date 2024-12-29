import { useEffect, useState } from "react";
import "./login.css";
import "font-awesome/css/font-awesome.min.css";
import SignUp from "./Signup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../context/authContext";

// import bcrypt from "bcryptjs";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const [] = useState("");

  const { user, login, loggedIn, setloggedIn, error, seterror } =
    useContext(authContext);
  const handleChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: e.target.value });
    console.log(formData);
  };
  const navigate = useNavigate();

  const dbsend = async () => {
    //   const saltRounds = 10;
    //   const hashedPassword = bcrypt.hashSync(formData.password, saltRounds);
    // console.log(hashedPassword)
    const datatosend = {
      email: formData.email,
      password: formData.password,
    };
    console.log("Sending data:", formData);

    try {
      login(datatosend);
      // console,log(response)
      //  console.log("Request successful:", send);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
      // console.log(send);
    }
  }, [loggedIn]);

  return (
    <section className="vh-100 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 text-black">
            <div className="px-5 ms-xl-4">
              <i
                className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4"
                style={{ color: "#709085" }}
              ></i>
              <span className="h1 fw-bold mb-0">blog</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
              <form style={{ width: "23rem" }} onSubmit={dbsend}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Login
                </h3>
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    id="form2Example18"
                    className="form-control form-control-lg"
                    placeholder="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="form2Example18">Email address</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    id="form2Example28"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="form2Example28">Password</label>
                </div>
                <div className="pt-1 mb-4">
                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-info btn-lg btn-block"
                    type="button"
                    onClick={dbsend}
                  >
                    Login
                  </button>
                </div>
                <p className="small mb-5 pb-lg-2">
                  <a className="text-muted" href="#!">
                    Forgot password?
                  </a>
                </p>
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-info">
                    Sign up here
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
              alt="Login image"
              className="w-100 vh-100"
              style={{ objectFit: "cover", objectPosition: "left" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
