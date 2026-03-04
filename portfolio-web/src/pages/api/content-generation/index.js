import dbConnect from "../../../lib/mongodb";
import ContentGeneration from "../../../models/ContentGeneration";
import { authenticate } from "../../../middleware/auth";

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
    case "DELETE":
      return deleteGalleryItem(req, res, id);
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public - Fetch all items
async function getGalleryItems(req, res) {
  try {
    const items = await ContentGeneration.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("Get gallery items error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected - Create new item
async function createGalleryItem(req, res) {
  try {
    // Remove empty strings to allow optional fields
    const data = { ...req.body };
    if (data.title === "") delete data.title;
    if (data.description === "") delete data.description;
    
    const item = await ContentGeneration.create(data);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("Create gallery item error:", error);
    console.error("Error details:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

// PUT - Protected - Update item by ID
async function updateGalleryItem(req, res, id) {
  try {
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    
    // Remove empty strings to allow optional fields
    const data = { ...req.body };
    if (data.title === "") delete data.title;
    if (data.description === "") delete data.description;
    
    const item = await ContentGeneration.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Update gallery item error:", error);
    console.error("Error details:", error.message);
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
    console.error("Error details:", error.message);
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
