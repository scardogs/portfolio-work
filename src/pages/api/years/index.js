import dbConnect from "../../../lib/mongodb";
import Year from "../../../models/Year";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const years = await Year.find({}).sort({ order: 1, year: -1 });
                res.status(200).json({ success: true, data: years });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}
