import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Plus, Edit2, Trash2, LogOut, AlertCircle } from 'lucide-react';

interface APK {
  id: number;
  name: string;
  status: string;
  size: string;
  downloads: number;
  imageUrl: string;
  borderColor: string;
  category: string;
}

interface FormData {
  name: string;
  status: string;
  size: string;
  downloads: number;
  imageUrl: string;
  borderColor: string;
  category: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: 'Free',
    size: '15MB',
    downloads: 0,
    imageUrl: '',
    borderColor: 'blue',
    category: '',
  });

  const { data: apks, refetch } = trpc.apks.getAll.useQuery();
  const createMutation = trpc.apks.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      alert('APK created successfully!');
    },
    onError: (err) => {
      alert('Error: ' + err.message);
    },
  });

  const updateMutation = trpc.apks.update.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      alert('APK updated successfully!');
    },
    onError: (err) => {
      alert('Error: ' + err.message);
    },
  });

  const deleteMutation = trpc.apks.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('APK deleted successfully!');
    },
    onError: (err) => {
      alert('Error: ' + err.message);
    },
  });

  useEffect(() => {
    // Check if admin is authenticated
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      setLocation('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'Free',
      size: '15MB',
      downloads: 0,
      imageUrl: '',
      borderColor: 'blue',
      category: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (apk: APK) => {
    setFormData({
      name: apk.name,
      status: apk.status,
      size: apk.size,
      downloads: apk.downloads,
      imageUrl: apk.imageUrl,
      borderColor: apk.borderColor,
      category: apk.category,
    });
    setEditingId(apk.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setLocation('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add New APK Button */}
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mb-8"
        >
          <Plus size={20} />
          Add New APK
        </button>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-6">
              {editingId ? 'Edit APK' : 'Add New APK'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">APK Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Free, Premium Unlocked"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 15MB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Downloads</label>
                <input
                  type="number"
                  value={formData.downloads}
                  onChange={(e) => setFormData({ ...formData, downloads: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Border Color</label>
                <select
                  value={formData.borderColor}
                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="pink">Pink</option>
                  <option value="cyan">Cyan</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Entertainment, Utilities"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-semibold"
                >
                  {editingId ? 'Update APK' : 'Create APK'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* APKs Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Downloads</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {apks && apks.length > 0 ? (
                  apks.map((apk) => (
                    <tr key={apk.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{apk.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{apk.status}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{apk.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{apk.downloads}K</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{apk.category}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(apk)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this APK?')) {
                              deleteMutation.mutate({ id: apk.id });
                            }
                          }}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No APKs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
