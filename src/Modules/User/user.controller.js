import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

import { sendEmailService } from "../../services/send-email.service.js";
import { ErrorClass } from "../../utils/index.js";
import {User} from "../../../DB/Models/index.js";


// signUp User

/** 
* @api {post} /user/signup
* @body firstName , lastName , email , password , recoveryEmail , DOB , mobileNumber , role
* @return signUp User
*/
 

export const signUp = async (req, res, next) => {
    console.log('Confirmation Secret:', process.env.CONFIRMATION_SECRET);

  // destruct data from req.body
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;

  // Check if the email already exists
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return next(
      new ErrorClass("Email already exists", 400, email, "SignUp api")
    );
  }
  // check if the phone already exists
  const isMobileNumberExist = await User.findOne({ mobileNumber });
  if (isMobileNumberExist) {
    return next(
      new ErrorClass(
        "MobilNumber already exists",
        400,
        mobileNumber,
        "SignUp API"
      )
    );
  }

  // take new instance
  const userInstance = new User({
    firstName,
    lastName,
    email,
    password: hashSync(password, +process.env.SALT_ROUNDS), // hash password (+) convert string to number
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });

  // generate token
  const token = jwt.sign(
  { _id: userInstance._id },
  process.env.CONFIRMATION_SECRET,
  { expiresIn: '10m' }
);
 
  // confirmation Link
  const confirmationLink = `${req.protocol}://${req.headers.host}/users/confirm-email/${token}`;
  // send email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Active Email",
    textMessage: "Active Email",
    htmlMessage: `<a href="${confirmationLink}">Click here to confirm your email To Active Email</a>`,
  });
  // check if email sent
  if (isEmailSent.rejected.length) {
    return next(
      new ErrorClass(
        "Email Not Sent",
        400,
        "Email Not Sent",
        email,
        "signUp api"
      )
    );
  }
  // Create a new user
  const user = await userInstance.save();

  // Respond with success
  res.status(201).json({ message: "Successfully registered", user });
};

// `-------------------------------------------------------------------------

/**
 * @api {get} /user/confirmEmail/:token
 * @return confirm Email
 */

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const { _id } = jwt.verify(token, process.env.CONFIRMATION_SECRET);
    const user = await User.findOneAndUpdate(
      { _id, isConfirmed: false },
      { isConfirmed: true },
      { new: true }
    );

    if (!user) {
      return next(new ErrorClass("User not found", 400, "Confirm Email"));
    }

    res.status(200).json({ message: "Email confirmed" });
  } catch (err) {
    // check token expired
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(token);
      // user data
      const user = await User.findById(decoded._id);

      if (user && !user.isConfirmed) {
        const newToken = jwt.sign(
          { _id: user._id },
          process.env.CONFIRMATION_SECRET,
          { expiresIn: "10m" }
        );
        // New confirmation Link
        const newConfirmationLink = `${req.protocol}://${req.headers.host}/users/confirm-email/${newToken}`;
        // send new email
        try {
          const isEmailSent = await sendEmailService({
            to: user.email,
            subject: "Email confirmation link expired",
            textMessage:
              "Hello, your email confirmation link has expired. Here is a new one.",
            htmlMessage: `<a href="${newConfirmationLink}">Click here to confirm your email</a>`,
          });

          // error if email not send
          if (isEmailSent.rejected.length) {
            return next(
              new ErrorClass("Email Not Sent", 400, user.email, "confirmEmail ")
            );
          }
          // if email send success
          return res.status(400).json({
            message:
              "Email confirmation link expired. A new confirmation link has been sent to your email.",
          });
        } catch (emailErr) {
          // if error in send new conformation
          return next(
            new ErrorClass(
              "Failed to send new confirmation email",
              500,
              emailErr.message
            )
          );
        }
      }

      return next(new ErrorClass("Token expired", 400, "Token expired"));
    }

    return next(new ErrorClass("Invalid token", 400, "Invalid token"));
  }
};

//-----------------------------------------------------------------------
