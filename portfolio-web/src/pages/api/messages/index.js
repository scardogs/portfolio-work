import dbConnect from "../../../lib/mongodb";
import Message from "../../../models/Message";
import PushSubscription from "../../../models/PushSubscription";
import { authenticate } from "../../../middleware/auth";
import webpush from 'web-push';

// Configure web-push
webpush.setVapidDetails(
    'mailto:johnmichael.escarlan14@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

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

        // Send Push Notification via Native Web Push
        try {
            const subscriptions = await PushSubscription.find({});
            const notificationPayload = JSON.stringify({
                title: "New Portfolio Message",
                body: `You received a new message from ${name}: ${subject}`,
                url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz"}/admin/manage/messages`
            });

            const pushPromises = subscriptions.map(sub => {
                const pushConfig = {
                    endpoint: sub.endpoint,
                    keys: {
                        auth: sub.keys.auth,
                        p256dh: sub.keys.p256dh
                    }
                };
                return webpush.sendNotification(pushConfig, notificationPayload)
                    .catch(err => {
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            return PushSubscription.deleteOne({ _id: sub._id });
                        }
                    });
            });

            await Promise.all(pushPromises);
        } catch (pushError) {
            console.error("Failed to send native push notification:", pushError);

            // Fallback to ntfy.sh just in case
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
            } catch (ntfyError) {
                console.error("Ntfy fallback failed too:", ntfyError);
            }
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
