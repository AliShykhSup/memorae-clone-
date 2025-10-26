import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Campaign from '../models/Campaign';
import Lead from '../models/Lead';
import Message from '../models/Message';

const router = Router();

// Get analytics for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({ userId: req.userId });
    const activeCampaigns = await Campaign.countDocuments({ 
      userId: req.userId,
      status: 'active'
    });

    // Get all campaigns for this user
    const userCampaigns = await Campaign.find({ userId: req.userId });
    const campaignIds = userCampaigns.map(c => c._id);

    const totalLeads = await Lead.countDocuments({ 
      campaignId: { $in: campaignIds }
    });

    const totalMessages = await Message.countDocuments({
      campaignId: { $in: campaignIds }
    });

    const sentMessages = await Message.countDocuments({
      campaignId: { $in: campaignIds },
      status: 'sent'
    });

    // Get recent campaigns
    const recentCampaigns = await Campaign.find({ userId: req.userId })
      .populate('instagramAccountId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalLeads,
      totalMessages,
      sentMessages,
      successRate: totalMessages > 0 ? ((sentMessages / totalMessages) * 100).toFixed(1) : 0,
      recentCampaigns
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
