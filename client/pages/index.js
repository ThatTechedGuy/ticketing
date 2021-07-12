import React from "react";
import AuthAPI from "../api/auth";

/**
 * Home Page Screen
 * @param {Object} currentUser
 * @param {String} currentUser.email
 * @param {String} currentUser.id
 */
const HomePage = ({ currentUser }) => {
  if (currentUser) {
    return <h1>You are signed in</h1>;
  }
  return <h1>You are not signed in</h1>;
};

HomePage.getInitialProps = async (ctx) => {
  const { data } = await AuthAPI.getCurrentUser(ctx);
  return data;
};

export default HomePage;
