import 'dotenv/config'
import express, { NextFunction, request, Request, Response } from 'express'
import { connectDatabase } from './config/db.config';
import CustomError, { errorHandler } from './middlewares/error-handler.middleware';


//importing routes 
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import brandRoutes from './routes/brand.routes'
import categoryRoutes from './routes/category.routes'

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI ?? '';

const app = express();

//connect DB
connectDatabase(DB_URI)

//using middlewares
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({ limit:'5mb', extended:true}))

app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:'server is up & running'
    })
})


//using routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/brand',brandRoutes)
app.use('/api/category',categoryRoutes)


app.all('/{*all}', (req:Request,res:Response,next:NextFunction) =>{
    const message = `Cannot ${req.method} on ${req.originalUrl}`
    const err:any = new CustomError(message,404)
    console.log(message)
    next(err)
})

app.listen( PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})



// using error handler
app.use(errorHandler)