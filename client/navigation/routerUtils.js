import Navigator from "next/router";

/**
 * @param {String} route
 * Push the given route onto the navigation stack.
 */
const push = (route, as) => Navigator.push(route, as);

const Router = {
  push,
};

const ROOT = "/";
const SIGNIN = "/auth/signin";
const SIGNUP = "/auth/signup";
const SIGNOUT = "/auth/signout";
const TICKETS_ROOT = "/tickets";
const NEW_TICKET = TICKETS_ROOT + "/new";
const GET_TICKET = TICKETS_ROOT + "/[ticketId]";

const ORDERS_ROOT = "/orders";
const GET_ORDER = ORDERS_ROOT + "/[orderId]";

export const Screens = {
  ROOT,
  SIGNIN,
  SIGNUP,
  SIGNOUT,
  NEW_TICKET,
  GET_TICKET,
  TICKETS_ROOT,
  ORDERS_ROOT,
  GET_ORDER,
};

export default Router;
