import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  //kis admin ne konsa course create keya hai
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export const Course = mongoose.model("Course", courseSchema);
