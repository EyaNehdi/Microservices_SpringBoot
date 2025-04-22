"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, Link, useNavigate } from "react-router-dom"
import PasswordStrengthMeter from "../components/PasswordStrengthMeter/PasswordStrengthMeter"
import { ToastContainer } from "react-toastify"
import { motion } from "framer-motion"
import { User, Mail, Lock, ArrowRight } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"
import "./login.css"

const Register = ({ setisRegisterSuccess }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const code = queryParams.get("code")

    if (code) {
      // linkedInLogin.onSuccess(code);
    }
  }, [location])

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== "")
    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== "")
    // Set form validity state
    setIsFormValid(!hasErrors && allFieldsFilled)
  }, [errors, formData])

  const validateForm = () => {
    const newErrors = {}

    // Validate first name: strictly letters and minimum 3 characters
    if (!/^[A-Za-z]{3,}$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name must be at least 3 letters and contain only letters."
    }

    // Validate last name: strictly letters and minimum 3 characters
    if (!/^[A-Za-z]{3,}$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name must be at least 3 letters and contain only letters."
    }

    // Validate email
    if (!/^[A-Za-z]+(?:\.[A-Za-z0-9]+)?@[A-Za-z]+\.[A-Za-z]+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email format (e.g., example@domain.com)."
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter."
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter."
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number."
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      const { name, value } = e.target

      // Field-specific validation
      switch (name) {
        case "firstName":
          newErrors.firstName = !/^[A-Za-z]{3,}$/.test(value.trim())
            ? "First name must be at least 3 letters and contain only letters."
            : ""
          break

        case "lastName":
          newErrors.lastName = !/^[A-Za-z]{3,}$/.test(value.trim())
            ? "Last name must be at least 3 letters and contain only letters."
            : ""
          break

        case "email":
          newErrors.email = !/^[A-Za-z]+(?:\.[A-Za-z0-9]+)?@[A-Za-z]+\.[A-Za-z]+$/.test(value.trim())
            ? "Invalid email format (e.g., example@domain.com)."
            : ""
          break

        case "password":
          if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters."
          } else if (!/[A-Z]/.test(value)) {
            newErrors.password = "Password must contain at least one uppercase letter."
          } else if (!/[a-z]/.test(value)) {
            newErrors.password = "Password must contain at least one lowercase letter."
          } else if (!/\d/.test(value)) {
            newErrors.password = "Password must contain at least one number."
          } else if (!/[^A-Za-z0-9]/.test(value)) {
            newErrors.password = "Password must contain at least one special character."
          } else {
            newErrors.password = ""
          }
          break

        default:
          break
      }

      return newErrors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setErrors({})

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, { withCredentials: true })

      if (response.data) {
        setisRegisterSuccess(true)
        navigate("/login")
      }

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="login-background">
        <div className="glass-card">
          <h2 className="text-center mb-4 text-white">Create Account</h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.firstName && <div className="text-warning mt-1 small">{errors.firstName}</div>}
            </div>

            <div className="form-group position-relative mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.lastName && <div className="text-warning mt-1 small">{errors.lastName}</div>}
            </div>

            <div className="form-group position-relative mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <div className="text-warning mt-1 small">{errors.email}</div>}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && <div className="text-warning mt-1 small">{errors.password}</div>}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <PasswordStrengthMeter password={formData.password} />
            </motion.div>

            <button disabled={!isFormValid || loading} className="login-button w-100" type="submit">
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Sign Up <ArrowRight className="login-arrow" size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-warning fw-bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
