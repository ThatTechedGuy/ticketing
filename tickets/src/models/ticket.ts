import { model, Schema, Document, Model } from "mongoose";

interface TicketAttrs {
  price: number;
  title: string;
  userId: string;
}

interface TicketDoc extends Document {
  price: number;
  title: string;
  userId: string;
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
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
