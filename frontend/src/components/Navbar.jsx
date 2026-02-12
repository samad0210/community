import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
          💬 CommunityHub
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                Hi, <span className="font-semibold">{user.username}</span>
                {isAdmin && (
                  <span className="ml-1.5 admin-badge">👑 Admin</span>
                )}
              </span>
              <Link to="/create" className="btn-primary text-sm py-1.5 px-3">
                + New Post
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
