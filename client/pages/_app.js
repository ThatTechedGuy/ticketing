import "bootstrap/dist/css/bootstrap.css";
import AuthAPI from "../api/auth";
import Header from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="p-5">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { data } = await AuthAPI.getCurrentUser(ctx);
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return {
    pageProps,
    ...data,
  };
};

export default App;
