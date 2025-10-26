import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI, instagramAPI } from '../services/api';
import { Campaign, InstagramAccount } from '../types';
import { Navbar } from '../components/Navbar';

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instagramAccountId: '',
    targetAudience: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsRes, accountsRes] = await Promise.all([
        campaignAPI.getCampaigns(),
        instagramAPI.getAccounts()
      ]);
      setCampaigns(campaignsRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await campaignAPI.createCampaign(
        formData.name,
        formData.instagramAccountId,
        formData.targetAudience
      );
      setShowCreateForm(false);
      setFormData({ name: '', instagramAccountId: '', targetAudience: '' });
      loadData();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await campaignAPI.activateCampaign(id);
      loadData();
    } catch (error) {
      console.error('Error activating campaign:', error);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await campaignAPI.pauseCampaign(id);
      loadData();
    } catch (error) {
      console.error('Error pausing campaign:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignAPI.deleteCampaign(id);
        loadData();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white' }}>Campaigns</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Campaign'}
          </button>
        </div>

        {showCreateForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">Create New Campaign</div>
            
            {accounts.length === 0 ? (
              <div className="alert alert-error">
                Please add an Instagram account first. <Link to="/instagram">Go to Instagram Accounts</Link>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label className="form-label">Campaign Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instagram Account</label>
                  <select
                    className="form-control"
                    value={formData.instagramAccountId}
                    onChange={(e) => setFormData({ ...formData, instagramAccountId: e.target.value })}
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        @{account.username} - {account.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., fitness enthusiasts, health coaches"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    required
                  />
                  <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                    AI will generate a personalized message based on this target audience
                  </small>
                </div>

                <button type="submit" className="btn btn-primary">
                  Create Campaign
                </button>
              </form>
            )}
          </div>
        )}

        <div className="card">
          {campaigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📢</div>
              <div className="empty-state-text">No campaigns yet</div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="campaign-card">
                <div className="campaign-header">
                  <Link 
                    to={`/campaigns/${campaign._id}`}
                    className="campaign-title"
                    style={{ textDecoration: 'none', color: '#333' }}
                  >
                    {campaign.name}
                  </Link>
                  <span className={`campaign-status status-${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>

                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  Target: {campaign.targetAudience}
                </p>
                <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/campaigns/${campaign._id}`} className="btn btn-sm btn-secondary">
                    View Details
                  </Link>
                  
                  {campaign.status === 'draft' && (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleActivate(campaign._id)}
                    >
                      Activate
                    </button>
                  )}
                  
                  {campaign.status === 'active' && (
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handlePause(campaign._id)}
                    >
                      Pause
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(campaign._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
