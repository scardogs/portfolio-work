import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a skill name"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Please provide an icon path"],
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

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
