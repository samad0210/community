import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId }) {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${postId}`);
      setComments(data.comments);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${postId}`, { content: commentText });
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${postId}/admin-reply`, { content: adminReplyText });
      setComments((prev) => [data.comment, ...prev]);
      setAdminReplyText('');
      toast.success('Official reply posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">
        Comments ({comments.length})
      </h3>

      {/* Admin Official Reply Box */}
      {isAdmin && (
        <form onSubmit={handleAdminReply} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-700 font-semibold text-sm">👑 Post Official Admin Reply</span>
          </div>
          <textarea
            value={adminReplyText}
            onChange={(e) => setAdminReplyText(e.target.value)}
            placeholder="Write an official response as admin..."
            rows={3}
            className="input-field text-sm resize-none mb-2"
          />
          <button type="submit" disabled={submitting || !adminReplyText.trim()} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-50">
            {submitting ? 'Posting...' : 'Post Official Reply'}
          </button>
        </form>
      )}

      {/* Regular Comment Box */}
      {user ? (
        <form onSubmit={handleAddComment} className="card">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="input-field text-sm resize-none mb-2"
          />
          <button type="submit" disabled={submitting || !commentText.trim()} className="btn-primary text-sm">
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3">
          <a href="/login" className="text-blue-600 font-medium hover:underline">Login</a> to leave a comment.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center text-gray-400 py-6">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-400 py-6">No comments yet. Be the first!</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={user}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, currentUser, isAdmin, onDelete }) {
  const date = new Date(comment.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const canDelete =
    currentUser &&
    (isAdmin || comment.author?._id === currentUser._id);

  return (
    <div
      className={`rounded-xl p-4 ${
        comment.isAdminReply
          ? 'bg-purple-50 border-l-4 border-purple-500 shadow-sm'
          : 'bg-white border border-gray-200'
      }`}
    >
      {/* Admin Reply Label */}
      {comment.isAdminReply && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-purple-700 font-bold text-xs uppercase tracking-wide">
            👑 Official Admin Response
          </span>
        </div>
      )}

      <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center font-semibold text-xs ${
              comment.isAdminReply ? 'bg-purple-200 text-purple-700' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {comment.author?.username?.[0]?.toUpperCase()}
          </div>
          <span className="font-medium">{comment.author?.username}</span>
          {comment.author?.role === 'admin' && (
            <span className="admin-badge">👑 Admin</span>
          )}
          <span>· {date}</span>
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-red-400 hover:text-red-600 text-xs transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
