import { useContext, useState } from "react";
import "./login.css";
// import "font-awesome/css/font-awesome.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import { authContext } from "../context/authContext";

function SignUp() {
  // State to hold form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const {backendUrl} = useContext(authContext)
  const [success, setSucess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datatosend = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // console.log("Sending data:", formData);

      const send = await axios.post(
        `${backendUrl}/auth/signup`,
        datatosend
      );
      console.log("Request successful:", send);
      console.log("Response data:", send.data);

      if (send.status === 200) {
        console.log("done");
        Navigate("/login");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    console.log(true);
    // alert("sign uo succesful please login");
  };

  return (
    <>
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
                <form style={{ width: "23rem" }} onSubmit={handleSubmit}>
                  {" "}
                  <h3
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Sign up
                  </h3>
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      id="form2Example1"
                      className="form-control form-control-lg"
                      placeholder="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    <label htmlFor="form2Example1">Full Name</label>
                  </div>
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
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      id="form2Example38"
                      className="form-control form-control-lg"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label htmlFor="form2Example38">Confirm Password</label>
                  </div>
                  <div className="pt-1 mb-4">
                    <button
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-info btn-lg btn-block"
                      type="submit"
                    >
                      Sign Up
                    </button>
                  </div>
                  <p className="small mb-5 pb-lg-2">
                    <a className="text-muted" href="#!">
                      Forgot password?
                    </a>
                  </p>
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="link-info">
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="Sign Up image"
                className="w-100 vh-100"
                style={{ objectFit: "cover", objectPosition: "left" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
