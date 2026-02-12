import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data.post);
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canDelete =
    user && (isAdmin || post.author?._id === user._id);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-1">
        ← Back to posts
      </Link>

      {/* Post */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight flex-1">
            {post.title}
          </h1>
          {canDelete && (
            <button onClick={handleDelete} className="btn-danger flex-shrink-0">
              Delete
            </button>
          )}
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <span className="font-medium text-gray-700">{post.author?.username}</span>
          {post.author?.role === 'admin' && <span className="admin-badge">👑 Admin</span>}
          <span>·</span>
          <span>{date}</span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Comments */}
      <div className="card">
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
}
