import dbConnect from "../../../lib/mongodb";
import ContentGeneration from "../../../models/ContentGeneration";
import Settings from "../../../models/Settings";
import { authenticate } from "../../../middleware/auth";

function normalizeTags(input) {
  if (!input) return [];
  const rawList = Array.isArray(input)
    ? input
    : typeof input === "string"
    ? input.split(",")
    : [];
  const seen = new Set();
  const result = [];
  for (const raw of rawList) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }
  return result;
}

async function syncTagsToSettings(tags = []) {
  const clean = normalizeTags(tags);
  if (clean.length === 0) return;
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ contentGalleryTags: clean });
    return;
  }
  const existing = Array.isArray(settings.contentGalleryTags)
    ? settings.contentGalleryTags
    : [];
  const merged = normalizeTags([...existing, ...clean]);
  settings.contentGalleryTags = merged;
  settings.markModified("contentGalleryTags");
  await settings.save();
}

async function getAvailableTags() {
  const [settings, distinctTags] = await Promise.all([
    Settings.findOne().lean(),
    ContentGeneration.distinct("tags"),
  ]);
  const settingsTags = Array.isArray(settings?.contentGalleryTags)
    ? settings.contentGalleryTags
    : [];
  return normalizeTags([...settingsTags, ...(distinctTags || [])]);
}

async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getGalleryItems(req, res);
    case "POST":
      return createGalleryItem(req, res);
    case "PUT":
      return updateGalleryItem(req, res, id);
    case "PATCH":
      return patchGalleryTags(req, res);
    case "DELETE":
      return deleteGalleryItem(req, res, id);
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public - Fetch items with pagination and available tags
async function getGalleryItems(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const tagFilter = req.query.tag ? String(req.query.tag).trim() : "";

    const query = tagFilter ? { tags: tagFilter } : {};

    const [items, total, videoCount, imageCount, availableTags] = await Promise.all([
      ContentGeneration.find(query)
        .sort({ createdAt: -1, order: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContentGeneration.countDocuments(query),
      ContentGeneration.countDocuments({ ...query, mediaType: "video" }),
      ContentGeneration.countDocuments({ ...query, mediaType: "image" }),
      getAvailableTags(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      data: items,
      availableTags,
      pagination: {
        page,
        limit,
        total,
        videoCount,
        imageCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Get gallery items error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected - Create new item
async function createGalleryItem(req, res) {
  try {
    const data = { ...req.body };
    if (data.title === "") delete data.title;
    if (data.description === "") delete data.description;
    data.tags = normalizeTags(data.tags);

    if (data.tags.length > 0) {
      await syncTagsToSettings(data.tags);
    }

    const item = await ContentGeneration.create(data);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

// PUT - Protected - Update item by ID
async function updateGalleryItem(req, res, id) {
  try {
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });

    const data = { ...req.body };
    if (data.title === "") delete data.title;
    if (data.description === "") delete data.description;
    if (data.tags !== undefined) {
      data.tags = normalizeTags(data.tags);
      if (data.tags.length > 0) {
        await syncTagsToSettings(data.tags);
      }
    }

    const item = await ContentGeneration.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Update gallery item error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

// PATCH - Protected - Tag management & bulk tagging operations
async function patchGalleryTags(req, res) {
  try {
    const { action, tag, tags, itemIds } = req.body || {};

    if (action === "createTag") {
      const newTags = normalizeTags(tags || tag);
      if (newTags.length === 0) {
        return res.status(400).json({ success: false, message: "Tag name is required" });
      }
      await syncTagsToSettings(newTags);
      const availableTags = await getAvailableTags();
      return res.status(200).json({ success: true, availableTags });
    }

    if (action === "deleteTag") {
      const targetTag = String(tag || "").trim();
      if (!targetTag) {
        return res.status(400).json({ success: false, message: "Tag name is required" });
      }
      const settings = await Settings.findOne();
      if (settings && Array.isArray(settings.contentGalleryTags)) {
        settings.contentGalleryTags = settings.contentGalleryTags.filter(
          (t) => t.toLowerCase() !== targetTag.toLowerCase()
        );
        settings.markModified("contentGalleryTags");
        await settings.save();
      }
      // Pull any case variation or exact match from all items
      const distinct = await ContentGeneration.distinct("tags");
      const matchingVariants = (distinct || []).filter(
        (t) => String(t).toLowerCase() === targetTag.toLowerCase()
      );
      const toPull = Array.from(new Set([targetTag, ...matchingVariants]));
      await ContentGeneration.updateMany(
        { tags: { $in: toPull } },
        { $pull: { tags: { $in: toPull } } }
      );
      const availableTags = await getAvailableTags();
      return res.status(200).json({ success: true, availableTags });
    }

    if (action === "bulkTag") {
      const cleanTags = normalizeTags(tags || tag);
      const validIds = Array.isArray(itemIds) ? itemIds.filter(Boolean) : [];
      if (cleanTags.length === 0 || validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Both itemIds and at least one tag are required",
        });
      }
      await syncTagsToSettings(cleanTags);
      await ContentGeneration.updateMany(
        { _id: { $in: validIds } },
        { $addToSet: { tags: { $each: cleanTags } } }
      );
      const availableTags = await getAvailableTags();
      return res.status(200).json({ success: true, availableTags });
    }

    if (action === "bulkUntag") {
      const cleanTags = normalizeTags(tags || tag);
      const validIds = Array.isArray(itemIds) ? itemIds.filter(Boolean) : [];
      if (cleanTags.length === 0 || validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Both itemIds and at least one tag are required",
        });
      }
      await ContentGeneration.updateMany(
        { _id: { $in: validIds } },
        { $pull: { tags: { $in: cleanTags } } }
      );
      const availableTags = await getAvailableTags();
      return res.status(200).json({ success: true, availableTags });
    }

    if (action === "setItemsForTag") {
      const cleanTag = normalizeTags(tag)[0];
      if (!cleanTag) {
        return res.status(400).json({ success: false, message: "Tag name is required" });
      }
      const validIds = Array.isArray(itemIds) ? itemIds.filter(Boolean) : [];
      await syncTagsToSettings([cleanTag]);

      if (validIds.length > 0) {
        await Promise.all([
          ContentGeneration.updateMany(
            { _id: { $in: validIds } },
            { $addToSet: { tags: cleanTag } }
          ),
          ContentGeneration.updateMany(
            { _id: { $nin: validIds } },
            { $pull: { tags: cleanTag } }
          ),
        ]);
      } else {
        await ContentGeneration.updateMany({}, { $pull: { tags: cleanTag } });
      }

      const availableTags = await getAvailableTags();
      return res.status(200).json({ success: true, availableTags });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error) {
    console.error("Patch gallery tags error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

// DELETE - Protected - Remove item by ID
async function deleteGalleryItem(req, res, id) {
  try {
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    const item = await ContentGeneration.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

export default async function (req, res) {
  const method = req.method?.toUpperCase();
  if (method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}

