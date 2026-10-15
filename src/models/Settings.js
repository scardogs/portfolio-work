import mongoose from "mongoose";

export const DEFAULT_SECTION_VISIBILITY = {
  hero: true,
  about: true,
  skills: true,
  projects: true,
  contentGeneration: true,
  milestones: true,
  experience: true,
  blog: true,
  contact: true,
};

export const DEFAULT_SECTION_ORDER = [
  "hero",
  "about",
  "skills",
  "projects",
  "contentGeneration",
  "milestones",
  "experience",
  "blog",
  "contact",
];

const SectionVisibilitySchema = new mongoose.Schema(
  {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    contentGeneration: { type: Boolean, default: true },
    milestones: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    splashCursorEnabled: {
      type: Boolean,
      default: true,
    },
    sectionVisibility: {
      type: SectionVisibilitySchema,
      default: () => ({ ...DEFAULT_SECTION_VISIBILITY }),
    },
    sectionOrder: {
      type: [String],
      default: () => [...DEFAULT_SECTION_ORDER],
    },
    contentGalleryTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model("Settings", SettingsSchema);
