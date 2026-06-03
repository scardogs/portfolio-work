import dbConnect from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { authenticate } from "../../../middleware/auth";

export default authenticate(async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const message = await Message.findById(id);
                if (!message) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: message });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedMessage = await Message.findByIdAndDelete(id);
                if (!deletedMessage) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
});
