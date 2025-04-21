import axios from "axios";
import {  useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter/PasswordStrengthMeter";
import {  ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Register = ({ setisRegisterSuccess }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
    //  linkedInLogin.onSuccess(code); // Ensure this is correctly called
    }
  }, [location]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    // Set form validity state
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [errors, formData]); // Re-run when errors or form data change

  //Controle de saisie
  const validateForm = () => {
    const newErrors = {};
  
    // Validate first name: strictly letters and minimum 3 characters
    if (!/^[A-Za-z]{3,}$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name must be at least 3 letters and contain only letters.";
    }
  
    // Validate last name: strictly letters and minimum 3 characters
    if (!/^[A-Za-z]{3,}$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name must be at least 3 letters and contain only letters.";
    }
  
    // Validate email: letters/numbers / optional period + @ + letters only + . + letters only
    if (!/^[A-Za-z]+(?:\.[A-Za-z0-9]+)?@[A-Za-z]+\.[A-Za-z]+$/
.test(formData.email.trim())) {
      newErrors.email = "Invalid email format (e.g., example@domain.com).";
    }
  
    // Validate password: min 6 chars, at least one uppercase, one lowercase, one number, one special character
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number.";
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const { name, value } = e.target;
      // Field-specific validation
      switch (name) {
        case "firstName":
          newErrors.firstName = !/^[A-Za-z]{3,}$/.test(value.trim())
            ? "First name must be at least 3 letters and contain only letters."
            : "";
          break;
      
        case "lastName":
          newErrors.lastName = !/^[A-Za-z]{3,}$/.test(value.trim())
            ? "Last name must be at least 3 letters and contain only letters."
            : "";
          break;
      
        case "email":
          newErrors.email = !/^[A-Za-z]+(?:\.[A-Za-z0-9]+)?@[A-Za-z]+\.[A-Za-z]+$/
.test(value.trim())
            ? "Invalid email format (e.g., example@domain.com)."
            : "";
          break;
      
        case "password":
          if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
          } else if (!/[A-Z]/.test(value)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
          } else if (!/[a-z]/.test(value)) {
            newErrors.password = "Password must contain at least one lowercase letter.";
          } else if (!/\d/.test(value)) {
            newErrors.password = "Password must contain at least one number.";
          } else if (!/[^A-Za-z0-9]/.test(value)) {
            newErrors.password = "Password must contain at least one special character.";
          } else {
            newErrors.password = ""; // No errors
          }
          break;
      
        default:
          break;
      }
      
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});
    if (!validateForm()) {
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post(
        "/api/auth/register",
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        setisRegisterSuccess(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="signup-form m-0">
        <h1 className="display-3 text-center mb-5">Let’s Sign Up </h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <span>
              <i className="feather-icon icon-user" />
            </span>

            <input
              type="text"
              placeholder=" FirstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              required
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}
          </div>
          <div className="form-group position-relative">
            <span>
              <i className="feather-icon icon-user" />
            </span>

            <input
              type="text"
              placeholder=" LastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              required
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}
          </div>
          <div className="form-group position-relative">
            <span>
              <i className="feather-icon icon-mail" />
            </span>

            <input
              type="email"
              placeholder=" Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group position-relative">
            <span>
              <i className="feather-icon icon-lock" />
            </span>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/*Password Strength meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
          >
            <div className="p-8">
              <PasswordStrengthMeter password={formData.password} />
            </div>
          </motion.div>
          {/*Password Strength meter ends*/}
          <button
            disabled={!isFormValid || loading}
            className="btn btn-primary w-100"
            style={{
              padding: "15px", // Augmente la hauteur du bouton
              fontSize: "18px", // Augmente la taille du texte
              borderRadius: "8px", // Arrondi les bords
            }}
          >
            {loading ? "Registering..." : "Sign Up "}
          </button>
        </form>
        <div className="form-footer mt-4 text-center">
          <div className="alter overly">
            <p>OR</p>
          </div>
          <p>
            Already have an account?{" "}
            <a href="/" className="text-primary fw-bold">
              Login Now
            </a>
          </p>
        </div>
      
      </div>
    </>
  );
};

export default Register;
