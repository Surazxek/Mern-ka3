import mongoose from 'mongoose'
export const connectDatabase = (uri:string)=>{

    mongoose.connect(uri).then(()=>{
        console.log('Database connected sucessfully')
    })
    .catch((error)=>{
        console.log(error)
    })

}