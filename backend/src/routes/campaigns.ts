import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Campaign from '../models/Campaign';
import Lead from '../models/Lead';
import Message from '../models/Message';
import InstagramAccount from '../models/InstagramAccount';
import { authenticate, AuthRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { campaignService } from '../services/campaignService';

const router = Router();

// Get all campaigns for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ userId: req.userId })
      .populate('instagramAccountId')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single campaign details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('instagramAccountId');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leads for a campaign
router.get('/:id/leads', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const leads = await Lead.find({ campaignId: req.params.id });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a campaign
router.get('/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const messages = await Message.find({ campaignId: req.params.id })
      .populate('leadId')
      .sort({ sentAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new campaign
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().trim(),
    body('instagramAccountId').notEmpty(),
    body('targetAudience').notEmpty().trim()
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, instagramAccountId, targetAudience } = req.body;

      // Verify Instagram account belongs to user
      const account = await InstagramAccount.findOne({
        _id: instagramAccountId,
        userId: req.userId
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      // Generate AI message
      const message = await aiService.generateMessage(targetAudience);

      // Create campaign
      const campaign = await Campaign.create({
        userId: req.userId,
        instagramAccountId,
        name,
        targetAudience,
        message,
        status: 'draft'
      });

      // Auto-generate demo leads
      await campaignService.generateDemoLeads(campaign._id.toString());

      const populatedCampaign = await Campaign.findById(campaign._id)
        .populate('instagramAccountId');

      res.status(201).json(populatedCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Activate campaign
router.post('/:id/activate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status === 'active') {
      return res.status(400).json({ error: 'Campaign is already active' });
    }

    // Activate campaign and send demo messages
    await campaignService.activateCampaign(req.params.id);

    const updatedCampaign = await Campaign.findById(req.params.id)
      .populate('instagramAccountId');

    res.json(updatedCampaign);
  } catch (error) {
    console.error('Error activating campaign:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pause campaign
router.post('/:id/pause', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.status = 'paused';
    await campaign.save();

    const updatedCampaign = await Campaign.findById(req.params.id)
      .populate('instagramAccountId');

    res.json(updatedCampaign);
  } catch (error) {
    console.error('Error pausing campaign:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete campaign
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Delete associated leads and messages
    await Lead.deleteMany({ campaignId: req.params.id });
    await Message.deleteMany({ campaignId: req.params.id });
    await Campaign.deleteOne({ _id: req.params.id });

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
