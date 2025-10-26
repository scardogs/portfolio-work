import mongoose from "mongoose";

const WorkExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please provide a position title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a job description"],
    },
    startDate: {
      type: String,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: String,
      default: "Present",
    },
    technologies: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
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

export default mongoose.models.WorkExperience ||
  mongoose.model("WorkExperience", WorkExperienceSchema);
