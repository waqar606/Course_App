import dotenv from "dotenv";
dotenv.config();
//when creating user controller
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

//when creating admin controller
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
export default {
  //for user JWT
  JWT_USER_PASSWORD,
  //for admin JWT_ADMIN_PASSWORD
  JWT_ADMIN_PASSWORD,

};

