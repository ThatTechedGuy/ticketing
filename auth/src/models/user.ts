import { model, Schema, Document, Model } from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema<UserDoc, UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    versionKey: false
  }
);

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.hash(this.get("password"));
    this.set("password", hashedPassword);
  }

  done();
});

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
