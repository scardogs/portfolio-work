import dbConnect from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
        case "GET":
            return getMessages(req, res);
        case "POST":
            return createMessage(req, res);
        default:
            return res
                .status(405)
                .json({ success: false, message: "Method not allowed" });
    }
}

// GET - Protected (Admin only)
async function getMessages(req, res) {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Get messages error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// POST - Public
async function createMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields",
            });
        }

        const newMessage = await Message.create(req.body);

        // Send push notification via ntfy.sh
        try {
            await fetch("https://ntfy.sh/jme-portfolio-messages-12345", {
                method: "POST",
                body: `You received a new message from ${name}: ${subject}`,
                headers: {
                    "Title": "New Portfolio Message",
                    "Priority": "high",
                    "Tags": "envelope,sparkles",
                    "Click": `${process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz"}/admin/manage/messages`
                }
            });
        } catch (pushError) {
            console.error("Failed to send push notification:", pushError);
        }

        return res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Create message error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export default function (req, res) {
    if (req.method === "POST") {
        return handler(req, res);
    }
    return authenticate(handler)(req, res);
}
