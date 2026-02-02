import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: [true, "Please provide a subject"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Please provide a message"],
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Message ||
    mongoose.model("Message", MessageSchema);
