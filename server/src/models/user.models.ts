//first_name,last_name, email, role, password

import mongoose from "mongoose";

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
     password:{
        type:String,
        required: [true, 'password is required'],
        min:4,
        select:false
    },
    role:{
        type:String,
        enum: ['USER',"ADMIN"],
        default:'USER'
    },
    phone_number:{
        type:String
    }
},{timestamps:true})

const User = mongoose.model('user',userSchema)

export default User