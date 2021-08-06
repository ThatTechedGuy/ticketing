import Api from "./api";
import Routes from "./routes";

const signup = async (email, password) =>
  await Api.post(Routes.SIGNUP, null, { email, password });

const signin = async (email, password) =>
  await Api.post(Routes.SIGNIN, null, { email, password });

const getCurrentUser = async (ctx) => await Api.get(Routes.CURRENT_USER, ctx);

const signout = async () => await Api.post(Routes.SIGNOUT);

const createTicket = async (title, price) =>
  await Api.post(Routes.CREATE_TICKET, null, { title, price });

const getAllTickets = async (ctx) => await Api.get(Routes.GET_ALL_TICKETS, ctx);

const getTicket = async (ticketId, ctx) =>
  await Api.get(Routes.GET_ALL_TICKETS + `/${ticketId}`, ctx);

const createOrder = async (ticketId) =>
  await Api.post(Routes.CREATE_ORDER, null, { ticketId });

const getOrder = async (orderId, ctx) =>
  await Api.get(Routes.GET_ORDER + `/${orderId}`, ctx);

const getAllOrders = async (ctx) => await Api.get(Routes.GET_ORDERS, ctx);

const createPayment = async (token, orderId) =>
  await Api.post(Routes.CREATE_PAYMENT, null, { token, orderId });

const AuthAPI = { signup, signin, getCurrentUser, signout };

const TicketAPI = { createTicket, getAllTickets, getTicket };

const OrdersAPI = { createOrder, getOrder, getAllOrders };

const PaymentsAPI = { createPayment };

export { AuthAPI, TicketAPI, OrdersAPI, PaymentsAPI };
