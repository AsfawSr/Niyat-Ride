import "./Login.css";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
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
  const { status, role } = useSelector((state) => state.auth);

  const [values, setValues] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(values)).unwrap();
      if (role === "admin") navigate("/dashboard");
      if (role === "dispacher") navigate("/dispatcher");
    } catch {}
  };

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

  return status === "loading" ? (
    <Loading />
  ) : (
    <>
      <h2 className="login-header max-[414px]:login-header-mobile mb-6">
        <img
          src={admin}
          alt="admin"
          width={90}
          height={90}
          className="dark:invert"
        />
        Login
      </h2>

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

// import { useState } from "react";
// import key from "../assets/mdkey.png";
// import email from "../assets/email.png";
// import admin from "../assets/admin.png";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../store/authSlice";
// import Input from "../Components/input";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { setError } from "../store/globalErrorSlice";
// import Loading from "../Components/Loading";
// const Login = () => {
//   const location = useLocation();
//   const Redirectpath = location.state?.path || "/";
//   const dispatch = useDispatch();
//   const { status, role } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const [values, setValues] = useState({
//     email: "",
//     password: "",
//   });
//   const InputChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };
//   const submitHandler = async (event) => {
//     event.preventDefault();
//     try {
//       await dispatch(loginUser(values)).unwrap();
//       if (role === "admin") navigate("/dashboard");
//       if (role === "dispacher") {
//         navigate("/dispatcher");
//       }
//     } catch (error) {}
//   };
//   const handleGoogleSuccess = async (response) => {
//     try {
//       dispatch(
//         authActions.login({
//           email: values.email,
//           name: "Google User",
//           fullName: "Google Admin",
//           _id: "google-123",
//           token: response.credential,
//           role: "admin",
//         })
//       );
//       navigate("/dashboard");
//     } catch (error) {
//       dispatch(setError("Google login failed!"));
//     }
//   };
//   const handleGoogleFailure = (error) => {
//     dispatch(setError("Login failed!"));
//   };
//   return (
//     <>
//       {status === "loading" ? (
//         <Loading />
//       ) : (
//         <>
//           <h2 className="flex items-center justify-center gap-10 text-[32px] font-bold max-[414px]:flex-col max-[414px]:text-[28px]">
//             <img
//               src={admin}
//               alt=""
//               width={90}
//               height={90}
//               className="dark:invert"
//             />
//             Login
//           </h2>

//           <GoogleOAuthProvider clientId="">
//             <form onSubmit={submitHandler} className="mx-1 lg:w-1/3 lg:mx-auto">
//               {/* Inputs */}
//               <div className="grid grid-cols-1 gap-8 mb-5">
//                 <Input
//                   type="email"
//                   id="email"
//                   name="email"
//                   label="Email:"
//                   placeholder="enter email"
//                   value={values.email}
//                   onChange={InputChangeHandler}
//                   icon={<img src={email} alt="" width={23} height={12} />}
//                 />
//                 <Input
//                   type="password"
//                   id="password"
//                   name="password"
//                   label="Password:"
//                   placeholder="enter password"
//                   value={values.password}
//                   onChange={InputChangeHandler}
//                   isVisible={true}
//                   icon={<img src={key} alt="" width={23} height={12} />}
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="block mx-auto bg-blue-500 text-white text-[20px] font-semibold px-6 py-3 rounded-lg hover:bg-black transition duration-300"
//               >
//                 Login
//               </button>

//               {/* Links */}
//               <div className="text-center text-[16px] my-5">
//                 <NavLink to="/Resetpassword" className="text-blue-500">
//                   Forgot Password
//                 </NavLink>
//               </div>

//               {/* Divider */}
//               <div className="relative text-center text-[14px] font-bold text-gray-500 my-6">
//                 <span className="relative z-10 bg-white px-3">
//                   OR CONTINUE WITH
//                 </span>
//                 <div className="absolute top-1/2 left-0 w-[35%] h-[3px] bg-gray-300"></div>
//                 <div className="absolute top-1/2 right-0 w-[35%] h-[3px] bg-gray-300"></div>
//               </div>

//               {/* Google Login */}
//               <div className="w-3/4 lg:w-1/2 mx-auto">
//                 <GoogleLogin
//                   onSuccess={handleGoogleSuccess}
//                   onError={handleGoogleFailure}
//                   useOneTap
//                   text="continue_with"
//                 />
//               </div>
//             </form>
//           </GoogleOAuthProvider>
//         </>
//       )}
//     </>
//   );
// };

// export default Login;
