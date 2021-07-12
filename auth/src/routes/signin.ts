import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    /* Throw an error if an associated user already exists. */
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid email.");
    }

    const isPasswordValid = await Password.compare(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid password.");
    }

    /* Generate auth token */
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    /* Store it in the session object */
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signinRouter };
