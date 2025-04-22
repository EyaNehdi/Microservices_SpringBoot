import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Preloader from "../components/Preloader/Preloader";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { User, Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "./login.css"; // Ajoute ce fichier CSS pour les styles avancés

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login(email, password, stayLoggedIn);
      navigate("/home");
    } catch (error) {
      if (error.response?.data?.message === "Account does not exist") {
        setErrorMessage("Account does not exist");
      } else {
        setErrorMessage(error.response?.data?.message || "Error logging in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="login-background">
          <div className="glass-card">
            <h2 className="text-center mb-4 text-white">Welcome Back</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group position-relative mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <User size={20} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group position-relative mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-check mb-3 text-white">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="stayLoggedIn"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="stayLoggedIn">
                  Stay Logged In
                </label>
              </div>
              <button className="btn btn-light w-100 py-2" style={{ borderRadius: "12px" }}>
                Sign In
              </button>
              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="text-center mt-3 text-white">
                Don’t have an account?{" "}
                <a href="/signup" className="text-warning fw-bold">
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
