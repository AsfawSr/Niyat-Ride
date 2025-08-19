import { useState } from "react";
import key from "../assets/mdkey.png";
import email from "../assets/email.png";
import call from "../assets/phone.png";
import admin from "../assets/admin.png";
import user from "../assets/user.png";
import Input from "../Components/input";
import useInput from "../Components/input-hook";
import { NavLink, useNavigate } from "react-router-dom";
import Windowresponsiv from "../Components/Windowresponsiv";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
// import { authActions } from "../store/authSlice";
// import api from "../api/api";
const AdminSignup = () => {
  const { width } = Windowresponsiv();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: enteredNameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    resetValue: resetNameValue,
  } = useInput((value) => value.trim() !== "");
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetValue: resetEmailValue,
  } = useInput((value) => value.includes("@"));
  const {
    value: enteredPhone,
    isValid: enteredPhoneIsValid,
    hasError: enteredPhoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    resetValue: resetPhoneValue,
  } = useInput((value) => value.trim().length === 10);
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetValue: resetPasswordValue,
  } = useInput((value) => value.trim().length > 6);
  const {
    value: confirmEnteredPassword,
    isValid: confirmEnteredPasswordIsValid,
    hasError: confirmEnteredPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    resetValue: resetConfirmPasswordValue,
  } = useInput((value) => value.trim().length > 6 && value === enteredPassword);
  const [loading, setLoading] = useState(false); // Loading state for the API call
  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      fullName: enteredName,
      email: enteredEmail,
      phone: enteredPhone,
      password: enteredPassword,
      passwordConfirm: confirmEnteredPassword,
    };
    // try {
    //   setLoading(true);
    //   const response = await api.post("/register", userData);
    //   alert("Registration successful!");
    //   // Reset form
    //   resetNameValue();
    //   resetEmailValue();
    //   resetPasswordValue();
    //   resetConfirmPasswordValue();
    // } catch (error) {
    // } finally {
    //   setLoading(false);
    // }
  };
  const handleGoogleSuccess = async (response) => {
    // try {
    //   const res = await api.post("/auth/google/register", {
    //     token: response.credential, // Send Google token to the backend
    //   });
    //   if (res.status === 200) {
    //     console.log(res);
    //     const { email, fullName, _id, role } = res.data.data.user;
    //     const name = fullName;
    //     dispatch(authActions.login({ email, name, _id, role }));
    //     console.log("navigating to home");
    //     navigate("/");
    //   }
    // } catch (error) {}
  };
  const handleGoogleFailure = (error) => {};
  return (
    <GoogleOAuthProvider clientId="">
      <div className="w-[72%] mx-[15%] mt-[50px] mb-[70px] max-[414px]:w-[98%] max-[414px]:mx-[1%]">
        <h2 className="text-[32px] font-bold mb-8 flex items-center justify-center gap-10 max-[414px]:flex-col max-[414px]:text-[28px] max-[414px]:gap-3">
          <img
            src={admin}
            alt=""
            width={90}
            height={90}
            className="dark:invert"
          />
          Admin Registration
        </h2>

        <form onSubmit={submitHandler}>
          {/* Grid Container for Inputs */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 mb-5">
            <Input
              type="text"
              id="fullName"
              name="fullName"
              label="Full Name"
              placeholder="Abebe Bekila"
              value={enteredName}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              hasError={enteredNameHasError}
              icon={<img src={user} alt="" width={20} height={20} />}
              required
            />
            <Input
              type="email"
              id="email"
              name="email"
              label="Email"
              placeholder="abebe@gmail.com"
              value={enteredEmail}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              hasError={enteredEmailHasError}
              icon={
                <img
                  src={email}
                  alt=""
                  width={width > 414 ? 17 : 23}
                  height={width > 414 ? 16 : 18}
                />
              }
              required
            />
            <Input
              type="number"
              id="Phone"
              name="Phone"
              label="Phone"
              placeholder="enter phone number"
              value={enteredPhone}
              onChange={phoneChangeHandler}
              onBlur={phoneBlurHandler}
              hasError={enteredPhoneHasError}
              icon={
                <img
                  className=" bg-white-500"
                  src={call}
                  alt=""
                  width={width > 414 ? 17 : 23}
                  height={width > 414 ? 16 : 18}
                />
              }
              required
            />

            <Input
              type="password"
              id="password"
              name="password"
              label="Password"
              placeholder="*************"
              value={enteredPassword}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              hasError={enteredPasswordHasError}
              icon={<img src={key} alt="" width={23} height={12} />}
              isVisible
              required
            />
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="**************"
              value={confirmEnteredPassword}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              hasError={confirmEnteredPasswordHasError}
              icon={<img src={key} alt="" width={23} height={12} />}
              required
            />
          </div>

          {/* Submit Button + Login Option */}
          <div className="mb-5">
            <button
              type="submit"
              className="block mx-auto bg-blue-500 text-white text-[20px] font-semibold px-6 py-3 rounded-lg hover:bg-black transition duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-center text-[16px] mt-4">
              Already have an account?{" "}
              <NavLink className="text-blue-500 " to="/">
                Login
              </NavLink>
            </p>
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
          <div className=" w-3/4 lg:w-1/4 mx-auto ">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              text="continue_with"
            />
          </div>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AdminSignup;
