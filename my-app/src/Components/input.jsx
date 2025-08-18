import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Input = ({
  id,
  label,
  type,
  name,
  value,
  placeholder,
  isVisible,
  hasError,
  onBlur,
  onChange,
  icon,
  domainIcon,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType =
    isVisible && type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col w-full mt-3">
      {/* Label */}
      <label
        htmlFor={id}
        className={`text-[22px] font-medium mb-2 ${
          hasError ? "text-red-500" : ""
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Wrapper */}
      <div
        className={`flex items-center overflow-hidden rounded-[10px] ${
          hasError ? "border border-red-500 bg-red-100" : "bg-[#dfdfdf]"
        }`}
      >
        {/* Icon Container */}
        <div
          className={`flex items-center justify-center ${
            domainIcon
              ? "w-1/5 text-[20px] text-gray-300"
              : "w-[12.7%] bg-black h-full"
          }`}
        >
          {domainIcon === undefined ? icon : domainIcon}
        </div>

        {/* Input Field */}
        <input
          type={inputType}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          className="flex-1 border-none outline-none bg-[#dfdfdf] text-gray-800 text-[20px] font-medium px-4 py-4 placeholder-gray-500"
        />

        {/* Password Toggle Icon */}
        {isVisible && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="flex items-center justify-center pr-3 cursor-pointer text-black text-[18px] hover:text-gray-700 bg-[#dfdfdf]"
          >
            {showPassword ? (
              <MdVisibility size={20} />
            ) : (
              <MdVisibilityOff size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
