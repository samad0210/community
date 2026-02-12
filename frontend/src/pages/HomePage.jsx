import { useState, useEffect } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/posts?page=${p}&limit=8`);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div>
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Platform</h1>
        <p className="text-gray-500 mb-4">Share your thoughts, join the conversation.</p>
        {user ? (
          <Link to="/create" className="btn-primary inline-block">
            ✏️ Write a Post
          </Link>
        ) : (
          <div className="flex justify-center gap-3">
            <Link to="/register" className="btn-primary inline-block">Join Now</Link>
            <Link to="/login" className="btn-secondary inline-block">Login</Link>
          </div>
        )}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-32 bg-gray-100" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first to start the conversation!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-3 text-sm text-gray-600">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                disabled={page === pagination.pages}
                className="btn-secondary disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
