import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import { Campaign, Lead, Message } from '../types';
import { Navbar } from '../components/Navbar';

export const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'messages'>('leads');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCampaignData();
    }
  }, [id]);

  const loadCampaignData = async () => {
    if (!id) return;

    try {
      const [campaignRes, leadsRes, messagesRes] = await Promise.all([
        campaignAPI.getCampaign(id),
        campaignAPI.getLeads(id),
        campaignAPI.getMessages(id)
      ]);
      setCampaign(campaignRes.data);
      setLeads(leadsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error loading campaign data:', error);
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

  if (!campaign) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card">Campaign not found</div>
        </div>
      </>
    );
  }

  const accountData = typeof campaign.instagramAccountId === 'object' 
    ? campaign.instagramAccountId 
    : null;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{campaign.name}</h1>
            <span className={`campaign-status status-${campaign.status}`}>
              {campaign.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Instagram Account</p>
              <p style={{ color: '#333' }}>
                {accountData ? `@${accountData.username} - ${accountData.displayName}` : 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Target Audience</p>
              <p style={{ color: '#333' }}>{campaign.targetAudience}</p>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Created</p>
              <p style={{ color: '#333' }}>{new Date(campaign.createdAt).toLocaleString()}</p>
            </div>
            {campaign.activatedAt && (
              <div>
                <p style={{ fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Activated</p>
                <p style={{ color: '#333' }}>{new Date(campaign.activatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div>
            <p style={{ fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>AI Generated Message</p>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', color: '#333' }}>
              {campaign.message}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              Leads ({leads.length})
            </button>
            <button
              className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages ({messages.length})
            </button>
          </div>

          {activeTab === 'leads' && (
            <div>
              {leads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-text">No leads yet</div>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Display Name</th>
                      <th>Type</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>@{lead.username}</td>
                        <td>{lead.displayName}</td>
                        <td>
                          {lead.isDemo ? (
                            <span style={{ 
                              background: '#17a2b8', 
                              color: 'white', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}>
                              Demo
                            </span>
                          ) : (
                            <span style={{ 
                              background: '#28a745', 
                              color: 'white', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}>
                              Real
                            </span>
                          )}
                        </td>
                        <td>{new Date(lead.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💬</div>
                  <div className="empty-state-text">No messages sent yet</div>
                  {campaign.status === 'draft' && (
                    <p style={{ color: '#666' }}>Activate the campaign to send demo messages</p>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((message) => {
                    const leadData = typeof message.leadId === 'object' ? message.leadId : null;
                    return (
                      <div key={message._id} style={{ 
                        background: '#f8f9fa', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        borderLeft: '4px solid #667eea'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#333' }}>
                            To: @{leadData?.username || 'Unknown'}
                          </strong>
                          <span style={{ 
                            background: message.status === 'sent' ? '#28a745' : '#dc3545',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {message.status}
                          </span>
                        </div>
                        <p style={{ color: '#666', marginBottom: '0.5rem' }}>{message.content}</p>
                        <small style={{ color: '#999' }}>
                          Sent: {new Date(message.sentAt).toLocaleString()}
                          {message.isDemo && ' (Demo)'}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
