import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Preloader from "../components/Preloader/Preloader";
import { useNavigate } from "react-router-dom";
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading,] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const {  login } = useAuthStore();

const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login(email, password, stayLoggedIn);
     navigate("/home"); // Redirect to home page after successful loggin
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      if (error.response?.data?.message === "Account does not exist") {
        setErrorMessage("Account does not exist");
      } else {
        setErrorMessage(error.response?.data?.message || "Error logging in");
      }
    }
  };


  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
      {isLoading ? (
        <Preloader />
      ) : (
        <div>
          <section className="signup-sec full-screen">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-5 col-md-5">
                  <div className="signup-thumb">
                    <img
                      className="img-fluid"
                      src="assets/images/shape-bg.png"
                      alt="Sign Up"
                    />
                  </div>
                </div>
                <div className="col-xl-7 col-md-7">
                  <div className="login-form">
                    <h1 className="display-3 text-center mb-5">
                      Let’s Sign In Trelix
                    </h1>
                    <form onSubmit={handleLogin}>
                      <div className="form-group position-relative">
                        <span>
                          <i className="feather-icon icon-mail" />
                        </span>
                        <input
                          type="email"
                          placeholder="Your Email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group position-relative">
                        <span>
                          <i className="feather-icon icon-lock" />
                        </span>
                        <input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        style={{
                          padding: "15px", // Augmente la hauteur du bouton
                          fontSize: "18px", // Augmente la taille du texte
                          borderRadius: "8px", // Arrondi les bords
                        }}
                      >
                        Sign In
                      </button>
                      <div className="form-footer mt-4 text-center">
                        <div className="d-flex justify-content-between">
                          <div className="form-check">
                            {/*Stay logged in input */}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="logged-in"
                              value={stayLoggedIn}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="logged-in"
                            >
                              Stay Logged In
                            </label>
                          </div>
                        </div>
                        <div className="alter overly">
                          <p>OR</p>
                        </div>

                        <p>
                          Don&apos;t have account?{" "}
                          <a href="/signup" className="text-primary fw-bold">
                            Sign Up Now
                          </a>
                        </p>
                      </div>
                      {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                      )}
                    </form>
                   
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
export default Login;
