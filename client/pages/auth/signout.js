import React, { useCallback, useEffect, useState } from "react";
import AuthAPI from "../../api/auth";
import Error from "../../components/error";
import Router, { Screens } from "../../navigation/routerUtils";

const Signout = () => {
  const [err, setErr] = useState();

  const signout = useCallback(async () => {
    const { errors } = await AuthAPI.signout();
    if (errors?.length) {
      setErr(errors);
    } else {
      Router.push(Screens.ROOT);
    }
  }, []);

  useEffect(() => {
    signout();
  }, []);

  if (err) {
    return <Error errors={err} />;
  }

  return <h4>Signing you out....</h4>;
};

export default Signout;
