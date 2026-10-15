import mongoose from "mongoose";

const ContactDetailSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Please provide a label"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Please provide a detail value"],
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const SocialLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Please provide a platform label"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please provide a URL"],
      trim: true,
    },
  },
  { _id: true }
);

const ContactSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    facebookUsername: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      default: "",
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
    details: {
      type: [ContactDetailSchema],
      default: undefined,
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: undefined,
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

// Force schema refresh in Next.js dev mode if already compiled
if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

export default mongoose.model("Contact", ContactSchema);
