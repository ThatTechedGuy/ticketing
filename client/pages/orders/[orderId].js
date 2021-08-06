import { useCallback, useEffect, useState } from "react";
import { OrdersAPI, PaymentsAPI } from "../../api/apiImpl";
import StripeCheckout from "react-stripe-checkout";
import { STRIPE_PUBLISHABLE_KEY } from "../../api/api";
import ErrorMessages from "../../components/error";
import Router, { Screens } from "../../navigation/routerUtils";

const OrderShow = ({ order, currentUser }) => {
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);

  const findTimeLeft = useCallback(() => {
    let msLeft = new Date(order.expiresAt) - new Date();
    msLeft = Math.round(msLeft / 1000);
    setTime(msLeft);
  }, []);

  const createPayment = useCallback(async ({ id }) => {
    setLoading(true);
    const { data, errors } = await PaymentsAPI.createPayment(id, order.id);
    setLoading(false);
    if (errors?.length) {
      setErrors(errors);
    } else {
      Router.push(Screens.ORDERS_ROOT);
    }
  }, []);

  useEffect(() => {
    findTimeLeft();

    const timer = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (loading) {
    return <h1>Processing payment....</h1>;
  }

  if (time < 0) {
    return <h1>Order expired!</h1>;
  }

  return (
    <div>
      <h1>Time left to pay: {time} seconds</h1>
      <StripeCheckout
        token={createPayment}
        stripeKey={STRIPE_PUBLISHABLE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        currency="INR"
      />
      <ErrorMessages errors={errors} />
    </div>
  );
};

OrderShow.getInitialProps = async (ctx) => {
  const { orderId } = ctx.query;

  const { data } = await OrdersAPI.getOrder(orderId, ctx);

  return { order: data };
};

export default OrderShow;
