import { model, Schema, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  price: number;
  title: string;
}

export interface TicketDoc extends Document {
  price: number;
  title: string;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

ticketSchema.set("versionKey", "version");
// @ts-ignore
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

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
