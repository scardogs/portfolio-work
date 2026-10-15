import dbConnect from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import { authenticate } from "../../../middleware/auth";

function buildDefaultDetails(doc) {
  const list = [];
  if (doc?.email) {
    list.push({
      label: "EMAIL",
      value: doc.email,
      link: `mailto:${doc.email}`,
    });
  }
  if (doc?.mobile) {
    list.push({
      label: "PHONE",
      value: doc.mobile,
      link: `tel:${String(doc.mobile).replace(/\s/g, "")}`,
    });
  }
  if (doc?.location) {
    list.push({
      label: "BASED",
      value: doc.location,
      link: "",
    });
  }
  if (list.length === 0) {
    list.push(
      {
        label: "EMAIL",
        value: "johnmichael.escarlan14@gmail.com",
        link: "mailto:johnmichael.escarlan14@gmail.com",
      },
      {
        label: "PHONE",
        value: "+63 995 7128385",
        link: "tel:+639957128385",
      },
      {
        label: "BASED",
        value: "Cebu City, PH",
        link: "",
      }
    );
  }
  return list;
}

function buildDefaultSocialLinks(doc) {
  const list = [];
  if (doc?.githubLink) {
    list.push({ label: "GitHub", url: doc.githubLink });
  }
  if (doc?.linkedinLink) {
    list.push({ label: "LinkedIn", url: doc.linkedinLink });
  }
  if (doc?.facebook) {
    list.push({ label: "Facebook", url: doc.facebook });
  }
  if (list.length === 0) {
    list.push(
      { label: "GitHub", url: "https://github.com" },
      { label: "LinkedIn", url: "https://linkedin.com" }
    );
  }
  return list;
}

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

    if (!contact) {
      contact = await Contact.create({
        facebook: "https://www.facebook.com/johnmichael.escarlan",
        facebookUsername: "@johnmichael.escarlan",
        email: "johnmichael.escarlan14@gmail.com",
        mobile: "09946760366",
        location: "Cebu City, PH",
        githubLink: "https://github.com",
        linkedinLink: "https://linkedin.com",
        details: [
          {
            label: "EMAIL",
            value: "johnmichael.escarlan14@gmail.com",
            link: "mailto:johnmichael.escarlan14@gmail.com",
          },
          {
            label: "PHONE",
            value: "09946760366",
            link: "tel:09946760366",
          },
          {
            label: "BASED",
            value: "Cebu City, PH",
            link: "",
          },
        ],
        socialLinks: [
          { label: "GitHub", url: "https://github.com" },
          { label: "LinkedIn", url: "https://linkedin.com" },
        ],
      });
    } else {
      let needsSave = false;
      if (!Array.isArray(contact.details)) {
        contact.details = buildDefaultDetails(contact);
        needsSave = true;
      }
      if (!Array.isArray(contact.socialLinks)) {
        contact.socialLinks = buildDefaultSocialLinks(contact);
        needsSave = true;
      }
      if (needsSave) {
        await contact.save();
      }
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
    const payload = { ...req.body, updatedAt: Date.now() };

    if (Array.isArray(payload.details)) {
      payload.details = payload.details
        .map((d) => ({
          label: String(d.label || "").trim(),
          value: String(d.value || "").trim(),
          link: String(d.link || "").trim(),
        }))
        .filter((d) => d.label && d.value);

      // Sync legacy top-level fields if matching labels exist
      const emailDetail = payload.details.find((d) =>
        /^(e-?mail)$/i.test(d.label)
      );
      const phoneDetail = payload.details.find((d) =>
        /^(phone|mobile|tel|contact)$/i.test(d.label)
      );
      const locationDetail = payload.details.find((d) =>
        /^(based|location|address|city)$/i.test(d.label)
      );
      if (emailDetail) payload.email = emailDetail.value;
      if (phoneDetail) payload.mobile = phoneDetail.value;
      if (locationDetail) payload.location = locationDetail.value;
    }

    if (Array.isArray(payload.socialLinks)) {
      payload.socialLinks = payload.socialLinks
        .map((s) => ({
          label: String(s.label || "").trim(),
          url: String(s.url || "").trim(),
        }))
        .filter((s) => s.label && s.url);

      const gh = payload.socialLinks.find((s) => /github/i.test(s.label));
      const li = payload.socialLinks.find((s) => /linkedin/i.test(s.label));
      const fb = payload.socialLinks.find((s) => /facebook/i.test(s.label));
      if (gh) payload.githubLink = gh.url;
      if (li) payload.linkedinLink = li.url;
      if (fb) payload.facebook = fb.url;
    }

    const contact = await Contact.findOneAndUpdate(
      {},
      { $set: payload },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Update contact error:", error);
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
