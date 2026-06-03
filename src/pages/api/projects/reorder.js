import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { projects } = req.body;

        if (!Array.isArray(projects)) {
            return res.status(400).json({ success: false, message: "Invalid project list" });
        }

        // Update each project's order based on its position in the array
        const updatePromises = projects.map((id, index) =>
            Project.findByIdAndUpdate(id, { order: index })
        );

        await Promise.all(updatePromises);

        return res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        console.error("Reorder projects error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export default authenticate(handler);
