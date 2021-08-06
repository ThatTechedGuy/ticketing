import { OrdersAPI } from "../../api/apiImpl";

const Orders = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} &mdash; {order.status}
          </li>
        );
      })}
    </ul>
  );
};

Orders.getInitialProps = async (ctx) => {
  const { data, errors } = await OrdersAPI.getAllOrders(ctx);

  return { orders: data };
};

export default Orders;
