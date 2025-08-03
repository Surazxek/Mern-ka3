//first_name,last_name, email, role, password

import mongoose from "mongoose";
import { Role } from "../types/enum.types";

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required: [true, 'first_name is required'],
        trim:true
    },
     last_name:{
        type:String,
        required: [true, 'last_name is required'],
        trim:true
    },
     email:{
        type:String,
        required: [true, 'email is required'],
        unique: [true,'user already exist with provided email'],
        trim:true
    },
    wish_list:[
        
        {
            type: mongoose.Schema.Types.ObjectId,
        required: [true, 'product is required'],
        ref:'product'
    }

    ],
     password:{
        type:String, 
        required: [true, 'password is required'],
        min:4,
        select:false
    },
    role:{
        type:String,
        enum: Object.values(Role),  //ENUM ROLE PASSED from enum.types.ts
        default:Role.USER
    },
    phone_number:{
        type:String
    }
},{timestamps:true})

const User = mongoose.model('user',userSchema)

export default User