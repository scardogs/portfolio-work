import dbConnect from '../../../lib/mongodb';
import PushSubscription from '../../../models/PushSubscription';
import { authenticate } from '../../../middleware/auth';

async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const subscription = req.body;

            // Upsert the subscription for the current user
            await PushSubscription.findOneAndUpdate(
                { endpoint: subscription.endpoint },
                {
                    ...subscription,
                    userId: req.user.id
                },
                { upsert: true, new: true }
            );

            return res.status(201).json({ success: true, message: 'Subscription saved' });
        } catch (error) {
            console.error('Push subscribe error:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
}

export default authenticate(handler);
