import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          to={`/posts/${post._id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
        >
          {post.title}
        </Link>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <span>{post.author?.username}</span>
          {post.author?.role === 'admin' && <span className="admin-badge">👑</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>💬 {post.commentCount || 0}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
