import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'User is required']
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required: [true, 'Product is required']
            },
            quantity:{
                type:Number,
                required:[true,'quantity is required'],
                default:0
            },
            total_price:{
                type:Number,
                required:true,
                default:0
            },
        },
    ],
    total_amount :{
        type:Number,
        required: [true,'total amount is required'],
        default:0
    },
})


const Cart = mongoose.model('cart',categorySchema)

export default Cart;


