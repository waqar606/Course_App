import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser'
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload'
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import path from "path";
const app=express()

app.use(bodyParser.json())
app.use(cookieParser())
const _dirname = path.resolve();


config({path:".env"})

//for photo upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))



//cloudinary setup

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
  });

// app.use(cors({
//     origin: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials:true,
//     allowedHeaders: ["Content-Type", "Authorization"],
// }))

const allowedOrigins = [
  'http://localhost:5173',
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


mongoose.connect(
    process.env.MONGO_URL,
    {
        dbName:"Course_Heaven"
    },

).then(()=>console.log("Mongoose Connected")).catch((err)=>console.log(err))

// defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);


 app.use(express.static(path.join(_dirname,"/frontend/dist")));
 app.get('/{*any}',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"Frontend","dist","index.html"));
 })

const PORT= process.env.PORT
app.listen(PORT,()=>console.log("Server is running"))

