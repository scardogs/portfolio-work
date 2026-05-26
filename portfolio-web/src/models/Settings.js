import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    splashCursorEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
