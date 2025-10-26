import { useState, useEffect } from 'react';
import { instagramAPI } from '../services/api';
import { InstagramAccount } from '../types';
import { Navbar } from '../components/Navbar';

export const InstagramAccounts = () => {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await instagramAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await instagramAPI.addAccount(formData.username, formData.displayName);
      setShowAddForm(false);
      setFormData({ username: '', displayName: '' });
      loadAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await instagramAPI.deleteAccount(id);
        loadAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
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
          <h1 style={{ color: 'white' }}>Instagram Accounts</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Account'}
          </button>
        </div>

        {showAddForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">Add Instagram Account (Demo Mode)</div>
            <form onSubmit={handleAddAccount}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="your_instagram_username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name or Brand"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
              </div>

              <div className="alert" style={{ 
                background: '#d1ecf1', 
                color: '#0c5460', 
                border: '1px solid #bee5eb',
                marginBottom: '1rem'
              }}>
                <strong>Demo Mode:</strong> This is a demonstration system. No actual Instagram connection is made.
                Real Instagram DM automation requires Instagram Business Account and Graph API integration.
              </div>

              <button type="submit" className="btn btn-primary">
                Add Account
              </button>
            </form>
          </div>
        )}

        <div className="card">
          {accounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📱</div>
              <div className="empty-state-text">No Instagram accounts added</div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Account
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Display Name</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account._id}>
                    <td>@{account.username}</td>
                    <td>{account.displayName}</td>
                    <td>
                      <span style={{ 
                        background: account.isActive ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(account._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
