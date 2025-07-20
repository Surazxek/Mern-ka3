import { model, Schema } from "mongoose";


const brandSchema = new Schema({
    name:{
        type:String,
        required:[true,'Brand name is required'],
        unique:[true,'Brand name already exist'],
        trim:true
    },
    description:{
        type:String
    }
},{timestamps:true})


const Brand = model('brand',brandSchema);

export default Brand