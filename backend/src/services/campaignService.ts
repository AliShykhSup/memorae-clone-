import Lead from '../models/Lead';
import Message from '../models/Message';
import { aiService } from './aiService';
import Campaign from '../models/Campaign';

export class CampaignService {
  /**
   * Generate demo leads when a campaign is created
   */
  async generateDemoLeads(campaignId: string): Promise<void> {
    const demoLeads = [
      { username: 'fitness_lover_22', displayName: 'Fitness Lover' },
      { username: 'healthy_lifestyle', displayName: 'Healthy Lifestyle' },
      { username: 'workout_daily', displayName: 'Workout Daily' }
    ];

    for (const lead of demoLeads) {
      await Lead.create({
        campaignId,
        username: lead.username,
        displayName: lead.displayName,
        isDemo: true
      });
    }
  }

  /**
   * Send demo messages when a campaign is activated
   */
  async sendDemoMessages(campaignId: string): Promise<void> {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const leads = await Lead.find({ campaignId, isDemo: true });

    for (const lead of leads) {
      // Generate personalized message for each lead
      const personalizedMessage = await aiService.generatePersonalizedMessage(
        campaign.targetAudience,
        lead.displayName
      );

      // Create message record
      await Message.create({
        campaignId,
        leadId: lead._id,
        content: personalizedMessage,
        status: 'sent',
        isDemo: true
      });
    }
  }

  /**
   * Activate a campaign and trigger auto-message sending
   */
  async activateCampaign(campaignId: string): Promise<void> {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Update campaign status
    campaign.status = 'active';
    campaign.activatedAt = new Date();
    await campaign.save();

    // Send demo messages
    await this.sendDemoMessages(campaignId);
  }
}

export const campaignService = new CampaignService();
