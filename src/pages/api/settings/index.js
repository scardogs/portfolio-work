import dbConnect from "../../../lib/mongodb";
import Settings, {
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_SECTION_ORDER,
} from "../../../models/Settings";
import { authenticate } from "../../../middleware/auth";

function normalizeSectionOrder(order) {
  if (!Array.isArray(order) || order.length === 0) {
    return [...DEFAULT_SECTION_ORDER];
  }
  const validSet = new Set(DEFAULT_SECTION_ORDER);
  const seen = new Set();
  const result = [];

  for (const key of order) {
    if (typeof key === "string" && validSet.has(key) && !seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result;
}

function normalizeSettings(doc) {
  const plain = doc?.toObject ? doc.toObject() : doc || {};
  return {
    ...plain,
    splashCursorEnabled: plain.splashCursorEnabled !== false,
    sectionVisibility: {
      ...DEFAULT_SECTION_VISIBILITY,
      ...(plain.sectionVisibility || {}),
    },
    sectionOrder: normalizeSectionOrder(plain.sectionOrder),
  };
}

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getSettings(req, res);
    case "PUT":
      return updateSettings(req, res);
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        splashCursorEnabled: true,
        sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
        sectionOrder: [...DEFAULT_SECTION_ORDER],
      });
    }
    return res.status(200).json({ success: true, data: normalizeSettings(settings) });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateSettings(req, res) {
  try {
    let existing = await Settings.findOne();
    const currentVisibility = {
      ...DEFAULT_SECTION_VISIBILITY,
      ...(existing?.sectionVisibility?.toObject
        ? existing.sectionVisibility.toObject()
        : existing?.sectionVisibility || {}),
    };

    const updatePayload = {};
    if (typeof req.body.splashCursorEnabled === "boolean") {
      updatePayload.splashCursorEnabled = req.body.splashCursorEnabled;
    }
    if (req.body.sectionVisibility && typeof req.body.sectionVisibility === "object") {
      const mergedVisibility = { ...currentVisibility };
      Object.keys(DEFAULT_SECTION_VISIBILITY).forEach((key) => {
        if (typeof req.body.sectionVisibility[key] === "boolean") {
          mergedVisibility[key] = req.body.sectionVisibility[key];
        }
      });
      updatePayload.sectionVisibility = mergedVisibility;
    }
    if (Array.isArray(req.body.sectionOrder)) {
      updatePayload.sectionOrder = normalizeSectionOrder(req.body.sectionOrder);
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );
    return res.status(200).json({ success: true, data: normalizeSettings(settings) });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default async function (req, res) {
  const method = req.method?.toUpperCase();
  if (method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
