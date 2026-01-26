import dbConnect from "../../../lib/mongodb";
import Year from "../../../models/Year";
import { authenticate } from "../../../middleware/auth";

export default authenticate(async function handler(req, res) {
    const { method } = req;

    if (method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const year = await Year.create(req.body);
        res.status(201).json({ success: true, data: year });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
