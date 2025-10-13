import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },
    github: {
      type: String,
      required: [true, "Please provide a GitHub link"],
      trim: true,
    },
    img: {
      type: String,
      default: "/LOGO.png",
    },
    website: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
