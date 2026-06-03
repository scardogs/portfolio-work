import mongoose from "mongoose";

const ContentGenerationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContentGeneration ||
  mongoose.model("ContentGeneration", ContentGenerationSchema);
