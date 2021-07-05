import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters."),
  ],
  async (req: Request, res: Response) => {
    /* Throw validation errors, if any. */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    /* Throw an error if an associated user already exists. */
    const existingUser = await User.findOne({ email });
    if (!!existingUser) {
      throw new BadRequestError("User already exists.");
    }

    /* Add the user to the database. */
    const user = User.build({ email, password });
    await user.save();

    /* Generate auth token */
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "asdf"
    );
    /* Store it in the session object */
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
