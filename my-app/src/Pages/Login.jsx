import { useState } from "react";
import key from "../assets/mdkey.png";
import email from "../assets/email.png";
import admin from "../assets/admin.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";
import Input from "../Components/input";
import Windowresponsiv from "../Components/Windowresponsiv";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setError } from "../store/errorSlice";

const Login = () => {
  const location = useLocation();
  const Redirectpath = location.state?.path || "/";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "admin", // ✅ default role is admin
  });

  const InputChangeHandler = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const role = values.role;

    // ✅ Save into Redux
    dispatch(
      authActions.login({
        email: values.email,
        name: role === "admin" ? "Admin" : "Dispatcher",
        fullName: role === "admin" ? "Admin User" : "Dispatcher User",
        _id: "12345",
        token: "dummy-token",
        role,
      })
    );

    // ✅ Redirect to proper dashboard
    if (role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/dispatcher", { replace: true });

    }
  };

  const { width } = Windowresponsiv();

  // ✅ Google login handler
  const handleGoogleSuccess = async (response) => {
    try {
      console.log("Google login success:", response);

      // For now, all Google logins = admin
      dispatch(
        authActions.login({
          email: values.email || "googleuser@example.com",
          name: "Google User",
          fullName: "Google Admin",
          _id: "google-123",
          token: response.credential,
          role: "admin", 
        })
      );

      navigate("/dashboard");
    } catch (error) {
      dispatch(setError("Google login failed!"));
    }
  };

  const handleGoogleFailure = (error) => {
    dispatch(setError("Login failed!"));
  };

  return (
    <>
      <h2 className="flex items-center justify-center gap-10 text-[32px] font-bold max-[414px]:flex-col max-[414px]:text-[28px] ">
        <img src={admin} alt="" width={90} height={90} className="dark:invert" />
        Login
      </h2>
      <GoogleOAuthProvider clientId="">
        <form onSubmit={submitHandler} className=" mx-1 lg:w-1/3 lg:mx-auto">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-8 mb-5">
            <Input
              type="email"
              id="email"
              name="email"
              label="Email:"
              placeholder="abebebekila@gmail.com"
              value={values.email}
              onChange={InputChangeHandler}
              icon={<img src={email} alt="" width={23} height={12} />}
            />
            <Input
              type="password"
              id="password"
              name="password"
              label="Password:"
              placeholder="************"
              value={values.password}
              onChange={InputChangeHandler}
              isVisible={true}
              icon={<img src={key} alt="" width={23} height={12} />}
            />

            {/* ✅ Role Selector */}
            <div className="flex gap-6 items-center justify-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={values.role === "admin"}
                  onChange={InputChangeHandler}
                />
                Admin
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="dispatcher"
                  checked={values.role === "dispatcher"}
                  onChange={InputChangeHandler}
                />
                Dispatcher
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="block mx-auto bg-blue-500 text-white text-[20px] font-semibold px-6 py-3 rounded-lg hover:bg-black transition duration-300"
          >
            Login
          </button>

          {/* Links */}
          <div className="text-center text-[16px] my-5">
            <NavLink to="/Resetpassword" className="text-blue-500">
              Forgot Password
            </NavLink>
            <br />
            If you haven't an account{" "}
            <NavLink to="/Signup" className="text-blue-500">
              Signup
            </NavLink>
          </div>

          {/* Divider */}
          <div className="relative text-center text-[14px] font-bold text-gray-500 my-6">
            <span className="relative z-10 bg-white px-3">OR CONTINUE WITH</span>
            <div className="absolute top-1/2 left-0 w-[35%] h-[3px] bg-gray-300"></div>
            <div className="absolute top-1/2 right-0 w-[35%] h-[3px] bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <div className="w-3/4 lg:w-1/2 mx-auto ">
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