import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.length < 5) return toast.error('Title must be at least 5 characters');
    if (form.content.length < 10) return toast.error('Content must be at least 10 characters');

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const { data } = await API.post('/posts', {
        title: form.title,
        content: form.content,
        tags,
      });
      toast.success('Post published! 🎉');
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create a Post</h2>
        <p className="text-gray-500 text-sm mb-6">Share something with the community</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="What's on your mind?"
              maxLength={150}
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">{form.title.length}/150</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your post content here..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 font-normal">(optional, comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, javascript, tips"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
              {loading ? 'Publishing...' : '🚀 Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary px-5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
