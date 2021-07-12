import Api from "./api";
import Routes from "./routes";

const signup = async (email, password) =>
  await Api.post(Routes.SIGNUP, { email, password });

const signin = async (email, password) =>
  await Api.post(Routes.SIGNIN, { email, password });

const getCurrentUser = async (ctx) => await Api.get(Routes.CURRENT_USER, ctx);

const signout = async () => await Api.post(Routes.SIGNOUT);

const AuthAPI = { signup, signin, getCurrentUser, signout };

export default AuthAPI;
