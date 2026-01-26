import mongoose from "mongoose";

const YearSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: [true, "Please provide a year"],
        },
        label: {
            type: String,
            required: [true, "Please provide a label for the year"],
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Year || mongoose.model("Year", YearSchema);
