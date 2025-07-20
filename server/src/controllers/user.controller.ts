import { NextFunction, request, Request, RequestHandler, response, Response } from "express";
import User from "../models/user.models";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";


// get all user
export const getAll = asyncHandler(async (
  req: Request,
  res: Response,
  
) => {
  
    const users = await User.find({});

    res.status(200).json({
      message: "users fetched",
      success: true,
      status: "success",
      data: users,
    });
 
})

//get by id

export const getById = asyncHandler(async(req:Request,res:Response) =>{
    
        const {id} = req.params

    const user = await User.findOne({_id: id})

    if(!user){
        throw new CustomError('User not found',404)
    }

    res.status(200).json({
      message: `User fetched`,
      success: true,
      status: "success",
      data:user
    })
    


})

//Remove user
export const removeUser = asyncHandler













// Update user
// export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const user = await User.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     }).select("-password");

//     if (!user) {
//       throw new CustomError("User not found", 404);
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       success: true,
//       status: "success",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


















//-----------------------------------------------------




// // get all user
// export const getAll = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const users = await User.find({});

//     res.status(200).json({
//       message: "users fetched",
//       success: true,
//       status: "success",
//       data: users,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// //get by id

// export const getById = async(req:Request,res:Response,next:NextFunction) =>{
//     try {
//         const {id} = req.params

//     const user = await User.findOne({_id: id})

//     if(!user){
//         throw new CustomError('User not found',404)
//     }

//     res.status(200).json({
//       message: `User fetched`,
//       success: true,
//       status: "success",
//       data:user
//     })
//     } catch (error) {
//         next(error)
//     }


// }

// //Remove user
// export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByIdAndDelete(id);

//     if (!user) {
//       throw new CustomError("User not found", 404);
//     }

//     res.status(200).json({
//       message: "User deleted successfully",
//       success: true,
//       status: "success",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };