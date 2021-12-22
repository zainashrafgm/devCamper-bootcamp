const express = require('express')
const path = require('path')
const dotenv=require('dotenv')
dotenv.config({path:'./config/config.env'})
const bootcamp = require("./Routes/Bootcamps")
const users = require("./Routes/users")
const morgan=require('morgan')
const connectDB=require('./config/db')
const loggers = require("./Middleware/logger")
const colors=require('colors')
const auth=require('./Routes/auth')
const course = require('./Routes/Course')
const fileUpload = require('express-fileupload')
const errorHandler = require('./Middleware/Error')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
var xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');







connectDB()

const app=express()

app.use(express.json())

app.use(cookieParser())

app.use(mongoSanitize());

//  set security header
app.use(helmet());

// prevent xss attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
 });
 app.use(limiter);
 
 // Prevent http param pollution
 app.use(hpp());
 
 app.use(cors())
 

// Dev logging middleware
if(process.env.NODE_ENV === "development")

{
    app.use(morgan('dev'))
}

app.use(fileUpload())

// set static folder

app.use(express.static(path.join(__dirname,'public')))

app.use("/api/v1/bootcamps",bootcamp)

app.use("/api/v1/users",users)

app.use('/api/v1/auth', auth);

app.use('/api/v1/course', course);



app.use(errorHandler)


// app.use(loggers)



const PORT=process.env.PORT || 6000

const server =app.listen(PORT,()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
})

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);

    //close server &exit process
    server.close(()=>process.exit(1))
})
