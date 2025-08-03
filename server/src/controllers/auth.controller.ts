import { Request, Response } from "express";
import User from "../models/user.models";
import CustomError from "../middlewares/error-handler.middleware";
import { compareHash, hashPassword } from "../utils/bcrypt.utils";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken } from "../utils/jwt.utils";
import { IJWTPlayload } from "../types/global.types";

// class AuthController {
//    async register (){

//     }
// }

// export const auth_controller = new AuthController()

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  //  Hash the password before saving
  const hashedPassword = await hashPassword(password);

  const user: any = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword, //  Store hashed password
    phone_number,
  });

  await user.save();
  console.log(user)

  const { password: pass, ...newUser } = user._doc;

  res.status(201).json({
    message: "Registration Successful",
    status: "success",
    success: true,
    data: newUser,
  });
});

//login

export const login = asyncHandler(async (req: Request, res: Response) => {
  //1.email & password
  const { email, password } = req.body;

  if (!email) {
    throw new CustomError("email is required", 400);
  }
  if (!password) {
    throw new CustomError("password is required", 400);
  }
  //2. find user by email

  const user: any = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid Credentials", 400);
  }
  //3. user.password === pass
  const isPassMatch = await compareHash(password, user.password ?? "");
  // user.password === password;

  if (!isPassMatch) {
    throw new CustomError("Invalid Credentials", 400);
  }

  const payload: IJWTPlayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  //generate token later

  const access_token = generateToken(payload); // passing payload

  const { password: pass, ...loggedInUsed } = user._doc;

  res
    .cookie("access_token", access_token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true, // brower ma natra janxa token client side le herna pauudaina
      maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      message: "Logged in Sucessfully",
      status: "success",
      success: true,
      data: {
        data: loggedInUsed,
        access_token,
      },
    });
});

//forget password

//change password

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { new_password, old_password, email } = req.body;

    if (!new_password) {
      throw new CustomError("new password is requied", 400);
    }

    if (!old_password) {
      throw new CustomError("old password is requied", 400);
    }

    if (!email) {
      throw new CustomError("email is requied", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new CustomError("Something went wrong", 400);
    }

    const isPassMatch = compareHash(old_password, user.password);

    if (!isPassMatch) {
      throw new CustomError("Password does not match", 400);
    }

    user.password = await hashPassword(new_password);

    await user.save();

    res.status(201).json({
      message: "Password Updated sucessfully",
      status: "success",
      success: true,
    });
  }
);
