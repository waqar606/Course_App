import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import dotenv from "dotenv";

//creating course same as blog
export const createCourse = async (req, res) => {
  //after creating admin
  const adminId = req.adminId;
  //after creating admin

  const { title, description, price } = req.body;
  // console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
    }

    // claudinary code
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

//update the course

// export const updateCourse = async (req, res) => {
//   const adminId = req.adminId; // Assume this comes from auth middleware
//   const { courseId } = req.params;

//   try {
//     const courseSearch = await Course.findById(courseId);
//     if (!courseSearch) {
//       return res.status(404).json({ errors: "Course not found" });
//     }

//     // Proceed with update
//     const course = await Course.findByIdAndUpdate(courseId, req.body, {
//       new: true,
//     });

//     res.status(200).json({ message: "Course updated successfully", course });
//   } catch (error) {
//     res.status(500).json({ errors: "Error in course updating" });
//     console.log("Error in course updating", error);
//   }
// };

//after sorting the problem image not change on updated

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const adminId = req.adminId;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    // Check if a new image was uploaded
    if (req.files && req.files.image) {
      const { image } = req.files;
      const allowedFormat = ["image/png", "image/jpeg"];

      if (!allowedFormat.includes(image.mimetype)) {
        return res
          .status(400)
          .json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
      }

      // Upload new image to Cloudinary
      const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
      if (!cloud_response || cloud_response.error) {
        return res
          .status(400)
          .json({ errors: "Error uploading file to cloudinary" });
      }

      // Delete old image from Cloudinary (optional)
      if (courseSearch.image && courseSearch.image.public_id) {
        await cloudinary.uploader.destroy(courseSearch.image.public_id);
      }

      // Update course with new image data
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
       
        {
          ...req.body,
          image: {
            public_id: cloud_response.public_id,
            url: cloud_response.url,
          },
        },
        { new: true }
      );
     

      res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } else {
      // No new image, just update other fields
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        
        req.body,
        { new: true }
      );
     

      res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    }
  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("Error in course updating", error);
  }
};

//delete id
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
};

//get all course
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses", error);
  }
};

//course detail when click on course

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};



import Stripe from "stripe";
import config from "../config.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // ✅ THIS IS THE MISSING PART
    // const newPurchase = await Purchase.create({
    //   userId,
    //   courseId,
    //   purchasedAt: new Date(), // optional field
    // });

    
    // const newPurchase=new Purchase({ userId, courseId})
    // await newPurchase.save()

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
    // res.status(201).json({
    //   message: "Course purchased successfully",
    //   purchase: newPurchase, // returning the purchase
    //   // course,
    //   clientSecret: paymentIntent.client_secret,
    // });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
