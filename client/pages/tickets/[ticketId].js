import { useCallback, useState } from "react";
import { OrdersAPI, TicketAPI } from "../../api/apiImpl";
import Router, { Screens } from "../../navigation/routerUtils";
import ErrorMessages from "./../../components/error";

const TicketShow = ({ ticket }) => {
  const [errors, setErrors] = useState();

  const initiatePurchase = useCallback(async () => {
    const { errors, data } = await OrdersAPI.createOrder(ticket.id);

    if (errors?.length) {
      setErrors(errors);
    } else {
      setErrors([]);
      Router.push(Screens.GET_ORDER, Screens.ORDERS_ROOT + `/${data.id}`);
    }
  }, []);

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className="btn btn-primary" onClick={initiatePurchase}>
        Purchase
      </button>
      <ErrorMessages errors={errors} />
    </div>
  );
};

TicketShow.getInitialProps = async (ctx) => {
  const { ticketId } = ctx.query;

  const { data } = await TicketAPI.getTicket(ticketId, ctx);

  return { ticket: data };
};

export default TicketShow;
