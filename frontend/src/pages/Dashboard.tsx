import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { Analytics } from '../types';
import { Navbar } from '../components/Navbar';

export const Dashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await analyticsAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
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
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Dashboard</h1>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-value">{analytics?.totalCampaigns || 0}</div>
            <div className="stat-label">Total Campaigns</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{analytics?.activeCampaigns || 0}</div>
            <div className="stat-label">Active Campaigns</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{analytics?.totalLeads || 0}</div>
            <div className="stat-label">Total Leads</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{analytics?.sentMessages || 0}</div>
            <div className="stat-label">Messages Sent</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Recent Campaigns</div>
          
          {analytics?.recentCampaigns && analytics.recentCampaigns.length > 0 ? (
            <div>
              {analytics.recentCampaigns.map((campaign) => (
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
                  <p style={{ color: '#999', fontSize: '0.875rem' }}>
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No campaigns yet</div>
              <Link to="/campaigns" className="btn btn-primary">
                Create Your First Campaign
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
