import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🚌 BusBooking
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                My Bookings
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary btn-small">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-small">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
