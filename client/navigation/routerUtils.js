import Navigator from "next/router";

/**
 * @param {String} route
 * Push the given route onto the navigation stack.
 */
const push = (route) => Navigator.push(route);

const Router = {
  push,
};

const ROOT = "/";
const SIGNIN = "/auth/signin";
const SIGNUP = "/auth/signup";
const SIGNOUT = "/auth/signout";

export const Screens = {
  ROOT,
  SIGNIN,
  SIGNUP,
  SIGNOUT,
};

export default Router;
