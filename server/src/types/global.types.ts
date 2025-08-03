
import mongoose from "mongoose";
import { Role } from "./enum.types";

export interface IJWTPlayload {
    _id:mongoose.Schema.Types.ObjectId,
    email:string,
    role:Role,
    first_name : string,
    last_name : string
}

export interface IJWTDecodedPayload extends IJWTPlayload {
    exp: number,
    iat: number
}

export const  allAdmins = [Role.ADMIN, Role.SUPER_ADMIN]
export const OnlyUser = [Role.USER]