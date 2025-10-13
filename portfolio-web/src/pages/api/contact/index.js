import dbConnect from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getContact(req, res);
    case "POST":
      return createContact(req, res);
    case "PUT":
      return updateContact(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getContact(req, res) {
  try {
    let contact = await Contact.findOne();

    // If no contact data exists, create default
    if (!contact) {
      contact = await Contact.create({
        facebook: "https://www.facebook.com/johnmichael.escarlan",
        facebookUsername: "@johnmichael.escarlan",
        email: "johnmichael.escarlan14@gmail.com",
        mobile: "09946760366",
      });
    }

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Get contact error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected
async function createContact(req, res) {
  try {
    const contact = await Contact.create(req.body);
    return res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error("Create contact error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateContact(req, res) {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Update contact error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default function (req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
