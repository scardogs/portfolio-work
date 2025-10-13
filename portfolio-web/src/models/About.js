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
