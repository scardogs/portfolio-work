import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    profileImage: {
      type: String,
      default: "/profile.png",
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    languages: {
      type: [String],
      default: [
        "English (Intermediate)",
        "Tagalog (Fluent)",
        "Hiligaynon (Fluent)",
      ],
    },
    education: {
      type: String,
      default: "Bachelor of Science in Information Technology",
    },
    jobTitle: {
      type: String,
      default: "Software Engineer",
    },
    tagline: {
      type: String,
      default: "Building thoughtful digital experiences",
    },
    quote: {
      type: String,
      default: "Identify patterns that others might miss.",
    },
    currentJobTitle: {
      type: String,
      default: "Software Developer",
    },
    currentCompany: {
      type: String,
      default: "Current Company",
    },
    githubLink: {
      type: String,
      default: "",
    },
    linkedinLink: {
      type: String,
      default: "",
    },
    portfolioLink: {
      type: String,
      default: "",
    },
    emailLink: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
