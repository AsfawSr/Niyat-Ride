import { useState } from "react";
import key from "../assets/mdkey.png";
import email from "../assets/email.png";
import admin from "../assets/admin.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";
import Input from "../Components/input"; // two levels up to src
import Windowresponsiv from "../Components/Windowresponsiv";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import api from "../api/api";
import { setError } from "../store/errorSlice";
const Login = () => {
  const location = useLocation();
  const Redirectpath = location.state?.path || "/";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    isChecked: false,
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

    // TEMP: fake login + go to dashboard
    dispatch(
      authActions.login({
        email: values.email,
        name: "Admin",
        fullName: "Admin User",
        _id: "12345",
        token: "dummy-token",
        role: "admin",
      })
    );

    navigate("/dashboard", { replace: true });
  };

  const { width } = Windowresponsiv();
  const handleGoogleSuccess = async (response) => {
    // try {
    //   const res = await api.post("/auth/google/login", {
    //     token: response.credential,
    //   });
    //   if (res.status === 200) {
    //     const {
    //       email,
    //       fullName,
    //       _id,
    //       adminName: adminName,
    //       role,
    //     } = res.data.data.user;
    //     const name = role === "admin" ? adminName : fullName;
    //     dispatch(authActions.login({ email, name, _id, role }));
    //     navigate("/Dashboard");
    //   }
    // } catch (error) {}
  };
  const handleGoogleFailure = (error) => {
    dispatch(setError("login failed!"));
  };

  return (
    <>
      <h2 className="flex items-center justify-center gap-10 text-[32px] font-bold max-[414px]:flex-col max-[414px]:text-[28px] ">
        <img
          src={admin}
          alt=""
          width={90}
          height={90}
          className="dark:invert"
        />
        Admin Login
      </h2>
      <GoogleOAuthProvider clientId="">
        <form onSubmit={submitHandler} className=" mx-1 lg:w-1/3 lg:mx-auto">
          {/* Grid for Inputs */}
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
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="block mx-auto bg-blue-500 text-white text-[20px] font-semibold px-6 py-3 rounded-lg hover:bg-black transition duration-300"
          >
            Login
          </button>
          {/* Forgot Password + Signup */}
          <div className="text-center text-[16px] my-5">
            <NavLink to="/Resetpassword" className="text-blue-500">
              Forgot Password
            </NavLink>
            <br />
            If you have n't an account{" "}
            <NavLink to="/Signup" className="text-blue-500">
              Signup
            </NavLink>
          </div>

          {/* Divider */}
          <div className="relative text-center text-[14px] font-bold text-gray-500 my-6">
            <span className="relative z-10 bg-white px-3">
              OR CONTINUE WITH
            </span>
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
