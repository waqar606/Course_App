import express from "express";
import {
    buyCourses,
    courseDetails,
    createCourse,
    deleteCourse,
    getCourses,
    updateCourse,
  
} from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

import adminMiddleware from "../middlewares/admin.mid.js";


const router = express.Router();
//use admin middleware


// router.post("/create", createCourse);
// router.put("/update/:courseId", updateCourse);
// router.delete("/delete/:courseId", deleteCourse);


router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);

router.post("/buy/:courseId", userMiddleware, buyCourses);


export default router;
