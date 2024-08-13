import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

import { sendEmailService } from "../../services/send-email.service.js";
import { ErrorClass } from "../../utils/index.js";
import {
  Brand,
  Category,
  Product,
  SubCategory,
  User,
} from "../../../DB/Models/index.js";

// signUp User

/**
 * @api {post} /users/signup
 * @body firstName , lastName , email , password , recoveryEmail , DOB , mobileNumber , role
 * @return signUp User
 */

export const signUp = async (req, res, next) => {
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
    { expiresIn: "10m" }
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
 * @api {get} /users/confirmEmail/:token
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

// 2-signIn User

/**
 * @api {post} /users/signIn
 * @body email, password, mobileNumber, recoveryEmail
 * @return token
 */
export const signIn = async (req, res, next) => {
  // destruct data from req.body
  const { email, password, mobileNumber, recoveryEmail } = req.body;

  // Check if the user exists
  const user = await User.findOne({
    $or: [{ email }, { mobileNumber }, { recoveryEmail }],
  });
  if (!user) {
    return next(
      new ErrorClass(
        "Email or Mobile Number or Password or  Recovery Email is incorrect",
        400,
        { email, password, mobileNumber, recoveryEmail },
        "SignIn API"
      )
    );
  }
  // check email is active by comfirm email
  if (user.isConfirmed === false) {
    return next(
      new ErrorClass(
        "Please Frist Active Your Email ",
        400,
        user.email,
        "SignIn API"
      )
    );
  }

  // Verify the password
  const isPasswordValid = compareSync(password, user.password);
  if (!isPasswordValid) {
    return next(
      new ErrorClass(
        "Email or Mobile Number or Password or  Recovery Email is incorrect",
        400,
        { email, password, mobileNumber, recoveryEmail },
        "SignIn API"
      )
    );
  }

  // Sign a JWT token with user's ID and a secret key (make sure to use a strong secret)
  const token = jwt.sign({ userId: user._id }, process.env.LOGIN_SECRET, {
    expiresIn: "1h",
  }); // Token expires in 1 hour

  // Update status from online
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    status: "online",
  });

  return res.status(200).json({ token });
};
//---------------------------
/**
 * @api {post} users/logOut
 * @return logout
 */
export const logOut = async (req, res, next) => {
  // check user is online
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass(
        "User must be online",
        400,
        "User must be online",
        "logout API"
      )
    );
  }
  // Update the  status of the user to "offline"
  const updatedUser = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      status: "offline",
    },
    { new: true }
  );
  // check user found
  if (!updatedUser) {
    return next(new ErrorClass("User not found", 404, "logout API"));
  }

  return res.status(200).json({ message: "LogOut Successful" });
};
//---------------------------
// Update account.
/**
 * @api {put} /users/updateAccount
 * @body firstName, lastName, email, mobileNumber, recoveryEmail, DOB
 * @return updated data
 */

export const updateAccount = async (req, res, next) => {
  // Check if the user is online
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass(
        "User must be online",
        400,
        "User must be online",
        "update account API"
      )
    );
  }
  console.log(req.authUser);

  // Destructure firstName, lastName, email, mobileNumber, recoveryEmail, DOB from the request body
  const { firstName, lastName, email, mobileNumber, recoveryEmail, DOB } =
    req.body;

  // Check email or mobile number uniqueness
  const existingUser = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  // If an existing user with the same email or mobile number is found, return an error
  if (existingUser) {
    return next(
      new ErrorClass(
        "Email or Mobile Number already exists",
        400,
        "Email or Mobile Number already exists",
        "update account API"
      )
    );
  }

  // If the email is updated, send a verification email
  if (email && email !== req.authUser.email) {
    // Update isConfirmed to false and status to offline
    const userInstance = await User.findByIdAndUpdate(
      req.authUser._id,
      {
        isConfirmed: false,
        status: "offline",
      },
      { new: true }
    );
    // Generate token
    const token = jwt.sign(
      { _id: userInstance._id },
      process.env.CONFIRMATION_SECRET,
      { expiresIn: "10m" }
    );

    // Create confirmation link
    const confirmationLink = `${req.protocol}://${req.headers.host}/users/confirm-email/${token}`;

    // Send email
    const isEmailSent = await sendEmailService({
      to: email,
      subject: "Please confirm your email",
      textMessage: "Please confirm your email",
      htmlMessage: `<a href="${confirmationLink}">Click here to confirm your email</a>`,
    });

    // If the email was not sent, return an error
    if (isEmailSent.rejected.length) {
      return next(
        new ErrorClass(
          "Email Not Sent",
          400,
          "Email Not Sent",
          email,
          "update account API"
        )
      );
    }
  }

  //  new variable contain user data
  const user = req.authUser;
  // check data is send or not (such new instance)
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (mobileNumber) user.mobileNumber = mobileNumber;
  if (recoveryEmail) user.recoveryEmail = recoveryEmail;
  if (DOB) user.DOB = DOB;
  // change username if find firstName and lastName
  if (firstName || lastName) {
    user.username = `${firstName || req.authUser.firstName}${
      lastName || req.authUser.lastName
    }`;
  }

  // Save the updated user data
  const updatedUser = await user.save();
  // Return success response
  return res.status(200).json({ message: "Update Successful", updatedUser });
};

//----------------------------

// delete account
/**
 * @api {delete} /users/deleteUser
 * @return deleted user
 */

export const deleteUser = async (req, res, next) => {
  // check status online
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass(
        "User must be online",
        400,
        "User must be online",
        "delete user API"
      )
    );
  }

  // delete user
  const deletedUser = await User.findByIdAndDelete(req.authUser._id);
  // user not found
  if (!deletedUser) {
    return next(new ErrorClass("User not found", 404, "delete user API"));
  }
  // delete Product related to user
  await Product.deleteMany({ addedBy: req.authUser._id });
  // delete Brand related to user
  await Brand.deleteMany({ addedBy: req.authUser._id });
  // delete subCategory related to user
  await SubCategory.deleteMany({ addedBy: req.authUser._id });
  // delete category related to user
  await Category.deleteMany({ addedBy: req.authUser._id });
  // return deleted user
  return res
    .status(200)
    .json({ message: "User deleted successfully", deletedUser });
};