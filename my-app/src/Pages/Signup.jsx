import { useEffect } from "react";
import key from "../assets/mdkey.png";
import email from "../assets/email.png";
import call from "../assets/phone.png";
import admin from "../assets/admin.png";
import user from "../assets/user.png";
import Input from "../Components/input";
import useInput from "../Components/input-hook";
import { useDispatch, useSelector } from "react-redux";
import "./Signup.css";
import Loading from "../Components/Loading";
import {
  clearState,
  registerUser,
} from "../store/authentication/registrationSlice";
import { useParams } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.registration);
  const { role } = useParams();
  const {
    value: enteredFirstName,
    hasError: enteredFirstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    resetValue: resetFirstNameValue,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLastName,
    hasError: enteredLastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    resetValue: resetLastNameValue,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    hasError: enteredEmailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetValue: resetEmailValue,
  } = useInput((value) => value.includes("@"));

  const {
    value: enteredPhone,
    hasError: enteredPhoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    resetValue: resetPhoneValue,
  } = useInput((value) => value.trim().length === 10);

  const {
    value: enteredPassword,
    hasError: enteredPasswordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetValue: resetPasswordValue,
  } = useInput((value) => value.trim().length > 6);

  const {
    value: confirmEnteredPassword,
    hasError: confirmEnteredPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    resetValue: resetConfirmPasswordValue,
  } = useInput((value) => value.trim().length > 6 && value === enteredPassword);

  const submitHandler = (e) => {
    e.preventDefault();
    if (enteredPassword !== confirmEnteredPassword) {
      alert("Passwords do not match!");
      return;
    }
    const userData = {
      firstName: enteredFirstName,
      lastName: enteredLastName,
      email: enteredEmail,
      phoneNumber: enteredPhone,
      password: enteredPassword,
      role: role,
      createrId: userId,
      assignedRegion: "mekelle",
    };
    console.log(role, userData);

    dispatch(registerUser({ userData }));
  };

  useEffect(() => {
    if (status === "succeeded") {
      alert("Registration successful!");
      resetFirstNameValue();
      resetLastNameValue();
      resetEmailValue();
      resetPhoneValue();
      resetPasswordValue();
      resetConfirmPasswordValue();
    }
    return () => {
      dispatch(clearState());
    };
  }, [status]);
  return (
    <>
      <div className="text-center pt-2">
        {status === "loading" && <Loading />}
        {status === "failed" && <p className="text-red-500">{error}</p>}
      </div>
      <div className="signup-container">
        <h2 className="signup-title">
          <img
            src={admin}
            alt=""
            width={90}
            height={90}
            className="dark:invert"
          />
          Registration Form of {role}
        </h2>

        <form onSubmit={submitHandler}>
          <div className="signup-grid">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              label="First Name"
              placeholder="enter first name"
              value={enteredFirstName}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              hasError={enteredFirstNameHasError}
              icon={<img src={user} alt="" width={20} height={20} />}
              required
            />
            <Input
              type="text"
              id="lastName"
              name="lastName"
              label="Last Name"
              placeholder="enter last name"
              value={enteredLastName}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
              hasError={enteredLastNameHasError}
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
              icon={<img src={email} alt="" width={23} height={18} />}
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
              icon={<img src={call} alt="" width={23} height={18} />}
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
          <button
            type="submit"
            className="signup-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
