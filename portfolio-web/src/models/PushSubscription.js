import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        unique: true
    },
    keys: {
        p256dh: String,
        auth: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

export default mongoose.models.PushSubscription || mongoose.model('PushSubscription', SubscriptionSchema);
