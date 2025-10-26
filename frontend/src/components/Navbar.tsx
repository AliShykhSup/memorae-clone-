import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        AutoIGDM Pro
      </Link>
      <div className="navbar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/instagram" 
          className={`nav-link ${isActive('/instagram') ? 'active' : ''}`}
        >
          Instagram Accounts
        </Link>
        <Link 
          to="/campaigns" 
          className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}
        >
          Campaigns
        </Link>
        <span style={{ color: '#666', marginLeft: '1rem' }}>
          {user?.name}
        </span>
        <button 
          onClick={handleLogout}
          className="btn btn-sm btn-secondary"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
