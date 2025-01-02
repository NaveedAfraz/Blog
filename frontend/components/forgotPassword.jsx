import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { authContext } from "../context/authContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [data, setdata] = useState([]);
  const [dbEmail, setdbEmail] = useState("");
  const [show, setshow] = useState(false);
  const [Token, setToken] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const { backendUrl } = useContext(authContext);
  const handleKeyPress = (e) => {
    if (e.key === "Backspace") {
      console.log("Backspace key pressed");
      setshow(false);
    }
  };
  console.log(show);
  const handleReset = async () => {
    setdbEmail("");
    try {
      const res = await axios.post(`${backendUrl}/auth/forgotPassword`, {
        email,
      });
      // console.log(res.data.token);
      // conso
      setToken(res.data.token);
      setshow(true);
      setdbEmail(res?.data?.data[0]?.EMAIL);
      // setdata(await res.data);
      // console.log(data);
      console.log(dbEmail);
      console.log(email);
    } catch (error) {
      setshow(true);
      console.log(error);
    }
  };

  const handleResetPass = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/auth/ResetPassword`,
        {
          Token,
          dbEmail,
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="vh-100">
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
                <form style={{ width: "23rem" }}>
                  <h3
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Forgot Password
                  </h3>

                  <div className="form-floating mb-4">
                    <input
                      type="email"
                      name="email"
                      id="form2Example18"
                      className="form-control form-control-lg"
                      placeholder="Email address"
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                    />
                    <label htmlFor="form2Example18">Email address</label>
                  </div>
                  {show == true ? (
                    dbEmail !== "" ? (
                      <p>EMAIL FOUND </p>
                    ) : (
                      <p>email not found pls register</p>
                    )
                  ) : null}

                  {show && email == dbEmail ? (
                    <div className="pt-1 mb-4">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-info btn-lg btn-block"
                        type="button"
                        onClick={handleResetPass}
                      >
                        Reset Password
                      </button>
                    </div>
                  ) : (
                    <div className="pt-1 mb-4">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-info btn-lg btn-block"
                        type="button"
                        onClick={handleReset}
                      >
                        Verfiy
                      </button>
                    </div>
                  )}

                  <p className="small mb-5 pb-lg-2">
                    <Link to="/login" className="text-muted">
                      Back to Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <div className="col-sm-6 px-0 d-none d-sm-block">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="Forgot Password Image"
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

export default ForgotPassword;
