import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserInDb, updateUserProfile } from '../../services/storageService';
import toast, { Toaster } from 'react-hot-toast';
import { User, PlanType } from '../../types';
import { Search, Edit2, Ban, CheckCircle, Save, X, Trash2, Shield, Mail } from 'lucide-react';
import { API_URL } from '../../config';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(users.filter(u =>
      (u.name?.toLowerCase() || '').includes(term) ||
      (u.email?.toLowerCase() || '').includes(term) ||
      (u.id?.toLowerCase() || '').includes(term)
    ));
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({ ...user });
  };

  const handleStatusToggle = async (user: User) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    if (confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} ${user.name}?`)) {
      try {
        const response = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          loadUsers();
        } else {
          alert('Failed to update user status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    }
  };

  const handleSave = async () => {
    if (editingUser && formData) {
      try {
        const response = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setEditingUser(null);
          loadUsers();
        } else {
          alert('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (editingUser) {
      if (confirm(`CRITICAL WARNING: This will permanently delete ${editingUser.name}. This action cannot be undone. Confirm delete?`)) {
        try {
          const response = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setEditingUser(null);
            loadUsers(); // Reload list
          } else {
            alert('Failed to delete user.');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Error deleting user.');
        }
      }
    }
  }

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View and manage all registered accounts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">User Profile</th>
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Current Plan</th>
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-150">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-100 to-indigo-100 dark:from-brand-900/30 dark:to-indigo-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold mr-3 border border-white dark:border-slate-600 shadow-sm">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" /> : user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${user.plan === PlanType.FREE ? 'bg-slate-100 border-slate-200 text-slate-600' :
                        user.plan === PlanType.UNLIMITED ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' :
                          'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                        }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className={`text-xs font-medium capitalize ${user.status === 'suspended' ? 'text-red-600' : 'text-slate-600 dark:text-slate-300'}`}>
                          {user.status || 'active'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <Shield className="h-3 w-3 mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">User</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`p-1.5 rounded-lg transition ${user.status === 'suspended'
                          ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                        title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                      >
                        {user.status === 'suspended' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No users found matching "{searchTerm}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Edit2 className="h-5 w-5 mr-2 text-brand-600" /> Edit User Profile
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Subscription Plan</label>
                  <select
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.plan}
                    onChange={e => setFormData({ ...formData, plan: e.target.value as PlanType })}
                  >
                    {Object.values(PlanType).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">System Role</label>
                  <select
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div>
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Danger Zone</p>
                    <p className="text-[10px] text-red-600/70 dark:text-red-400/70">Permanently delete this user account.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition shadow-lg text-sm flex items-center">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;