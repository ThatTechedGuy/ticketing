import { model, Schema, Document, Model } from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id?: string;
  price: number;
  title: string;
}

export interface TicketDoc extends Document {
  price: number;
  title: string;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  if (attrs.id) {
    const { id, ...otherFields } = attrs;
    return new Ticket({
      _id: attrs.id,
      ...otherFields,
    });
  }

  return new Ticket(attrs);
};

/** Check if this ticket is not already reserved.
 *  Run a query to look at all the orders and find an order
 *  associated with this ticket id. The order should not have
 *  a cancelled state. If the order in question is found,
 *  the ticket has already been reserved
 *  @returns {Promise<boolean>} existingOrder
 */
ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  // not an arrow function because the 'this' keyword
  // needs to be accessed.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
