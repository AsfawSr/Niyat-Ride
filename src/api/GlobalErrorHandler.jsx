import React from "react";
import { useSelector } from "react-redux";

const GlobalError = () => {
  const { errors } = useSelector((state) => state.error);
  if (errors.length === 0) return null;
  console.log(errors);
  return (
    <div
      style={{
        background: "red",
        borderRadius: "12px",
        color: "white",
        padding: "10px",
      }}
    >
      <strong> Errors:</strong>
      <ul>
        {errors.map((err, index) => (
          <li key={index}>
            {err.source}: {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default GlobalError;
