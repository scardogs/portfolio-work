import dbConnect from "../../../lib/mongodb";
import Year from "../../../models/Year";
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
                const year = await Year.findById(id);
                if (!year) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: year });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const year = await Year.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!year) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: year });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedYear = await Year.deleteOne({ _id: id });
                if (!deletedYear) {
                    return res.status(404).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
});
