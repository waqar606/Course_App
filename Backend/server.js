import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

config({ path: ".env" });

//for photo upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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

app.use(
  cors({
    origin: ["http://localhost:5173", "https://course-app-vj3i.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Course_Heaven",
  })
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));

// defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is running"));
