import React, { useCallback, useRef, useState } from "react";
import AuthAPI from "../../api/auth";
import FormError from "../../components/error";
import Router, { Screens } from "../../navigation/routerUtils";

const Signup = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [errors, setErrors] = useState();

  const submit = useCallback(async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const { errors } = await AuthAPI.signup(email, password);
    if (errors?.length) {
      setErrors(errors);
    } else {
      Router.push(Screens.ROOT);
    }
  }, []);

  return (
    <form onSubmit={submit}>
      <h1>Sign up</h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input ref={emailRef} className="form-control" />
        <div className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <label htmlFor="password" className="form-label">
        Password
      </label>
      <input ref={passwordRef} className="form-control" type="password" />
      <div className="form-text">
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </div>
      <button type="submit" className="btn btn-primary">
        Sign up
      </button>
      <FormError errors={errors} />
    </form>
  );
};

export default Signup;
