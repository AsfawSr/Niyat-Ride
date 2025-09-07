import "./Login.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authentication/loginSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setError } from "../store/globalErrorSlice";
import Loading from "../Components/Loading";
import admin from "../assets/admin.png";
import key from "../assets/mdkey.png";
import email from "../assets/email.png";
import Input from "../Components/input";

const Login = () => {
  const location = useLocation();
  const redirectPath = location.state?.path || "/";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, role, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [values, setValues] = useState({ email: "", password: "" });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(values));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "admin") navigate("/dashboard");
      if (role === "dispatcher") navigate("/dispatcher");
    }
  }, [isAuthenticated, role, navigate]);

  const handleGoogleSuccess = async (response) => {
    try {
      dispatch(
        authActions.login({
          email: values.email,
          name: "Google User",
          fullName: "Google Admin",
          _id: "google-123",
          token: response.credential,
          role: "admin",
        })
      );
      navigate("/dashboard");
    } catch {
      dispatch(setError("Google login failed!"));
    }
  };

  const handleGoogleFailure = () => {
    dispatch(setError("Login failed!"));
  };

  return (
    <>
      <h2 className="login-header max-[414px]:login-header-mobile mb-6">
        <img
          src={admin}
          alt="admin"
          width={90}
          height={90}
          className="dark:invert"
        />
        Login Page
      </h2>
      {/* Status Messages */}
      <div className="text-center pt-2">
        {status === "loading" && <Loading />}
        {status === "failed" && <p className="text-red-500">{error}</p>}
      </div>

      <GoogleOAuthProvider clientId="">
        <form onSubmit={handleSubmit} className="login-form-wrapper">
          <div className="login-form-grid">
            <Input
              type="email"
              id="email"
              name="email"
              label="Email:"
              placeholder="Enter email"
              value={values.email}
              onChange={handleInputChange}
              icon={<img src={email} alt="" width={23} height={12} />}
            />
            <Input
              type="password"
              id="password"
              name="password"
              label="Password:"
              placeholder="Enter password"
              value={values.password}
              onChange={handleInputChange}
              isVisible
              icon={<img src={key} alt="" width={23} height={12} />}
            />
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>

          <div className="login-link">
            <NavLink to="/Resetpassword">Forgot Password</NavLink>
          </div>

          <div className="login-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="login-google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              text="continue_with"
            />
          </div>
        </form>
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;
