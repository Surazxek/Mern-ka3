import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enum.types";
import CustomError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";

export const authenticate = (roles?: Role[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    try {
      //get token from cookies 

      const access_token = req.cookies.access_token;

      if (!access_token)
        throw new CustomError("Unauthorized Access Denied", 401);

      const decodedData = verifyToken(access_token);

      if (Date.now() > decodedData.exp * 1000) {
        throw new CustomError("Session Expired. Access Denied", 401);
      }
      const user = await User.findById(decodedData._id)
      console.log(decodedData);

      if(!user){
        throw new CustomError('Unauthorized. Access Denied',401)
      }

      // roles.inlcudes(userRole)

      if(roles && !roles.includes(decodedData.role)){
        throw new CustomError('Unauthorized. Access denied',403)
      }
      
      req.user = {
        _id:decodedData._id,
        email:decodedData.email,
        role:decodedData.role,
        first_name:decodedData.first_name,
        last_name:decodedData.last_name
      }   //import { IJWTPlayload } from "./global.types"; making request manually 
      

      //roles.includes(userRole)  ->

      next();
    } catch (error) {
      next(error);
      //next()
    }

    //next(error)
  };
};
