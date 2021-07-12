import React from "react";

const Error = ({ errors }) => {
  if (!errors?.length) {
    return null;
  }
  return (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Error;
