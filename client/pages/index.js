import React, { memo } from "react";
import { TicketAPI } from "../api/apiImpl";
import Link from "next/link";
import { Screens } from "../navigation/routerUtils";

/**
 * A ticket data struct component
 * @param {String} id
 * @param {String} title
 * @param {Number} price
 */
const TicketItem = memo(({ title, price, id }) => {
  return (
    <tr>
      <td>{title}</td>
      <td>{price}</td>
      <td>
        <Link href={Screens.GET_TICKET} as={Screens.TICKETS_ROOT + `/${id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  );
});

const renderTicket = (ticket) => <TicketItem {...ticket} key={ticket.id} />;

/**
 * Home Page Screen
 * @param {Object} currentUser
 * @param {String} currentUser.email
 * @param {String} currentUser.id
 */
const HomePage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(renderTicket);

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

HomePage.getInitialProps = async (ctx) => {
  const { data } = await TicketAPI.getAllTickets(ctx);

  return { tickets: data };
};

export default HomePage;
