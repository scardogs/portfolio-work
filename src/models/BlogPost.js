import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogPostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const words = (this.content || "").trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(words / 220));
  }
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
