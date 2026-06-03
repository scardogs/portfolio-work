import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      required: [true, "Please provide a Facebook link"],
      trim: true,
    },
    facebookUsername: {
      type: String,
      required: [true, "Please provide a Facebook username"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Please provide a mobile number"],
      trim: true,
    },
    location: {
      type: String,
      default: "Cebu City, PH",
      trim: true,
    },
    githubLink: {
      type: String,
      default: "",
      trim: true,
    },
    linkedinLink: {
      type: String,
      default: "",
      trim: true,
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

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
