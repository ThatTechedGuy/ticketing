import "bootstrap/dist/css/bootstrap.css";
import { AuthAPI } from "../api/apiImpl";
import Header from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container pt-5">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { data } = await AuthAPI.getCurrentUser(ctx);
  let pageProps = {};
  /**
   * Call the getInitialProps function of the child components,
   * and pass the returned results as props to the
   * child components.
   */
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return {
    pageProps,
    ...data,
  };
};

export default App;
