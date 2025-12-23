import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, PlanType, WritingStyle } from '../types';
import { User as UserIcon, Mail, CreditCard, Shield, Key, Edit2, Save, X, Camera, Plus, Trash2, Link as LinkIcon, FileText, Upload, AlertTriangle, Lock, Check } from 'lucide-react';
import { updateUserProfile, cancelSubscription } from '../services/storageService';
import { updateUserInFirestore } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

interface SettingsPageProps {
  user: User;
  onUserUpdate: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user: initialUser, onUserUpdate }) => {
  const navigate = useNavigate();
  const { updateName, changePassword } = useAuth();
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Writing Style States
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [newStyle, setNewStyle] = useState({ name: '', type: 'text', content: '' });

  // Cancel Subscription States
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Password Change States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async () => {
    // Validate inputs
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      if (formData.name !== user.name) {
        await updateName(formData.name);
      }

      // Update Firestore if user is authenticated
      if (auth.currentUser) {
        await updateUserInFirestore(auth.currentUser.uid, {
          name: formData.name,
          avatarUrl: formData.avatarUrl || undefined
        });
      }

      // Update localStorage
      const updatedUser = updateUserProfile({
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl || undefined
      });

      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false);
        onUserUpdate(); // Sync with App layout immediately
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to ~500KB to avoid localStorage quotas in this demo
    if (file.size > 500 * 1024) {
      alert("File is too large. Please upload an image smaller than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAddStyle = () => {
    if (!newStyle.name || !newStyle.content) return;

    const style: WritingStyle = {
      id: Date.now().toString(),
      name: newStyle.name,
      sourceType: newStyle.type as 'text' | 'url',
      content: newStyle.content
    };

    const currentStyles = user.writingStyles || [];
    const updatedStyles = [...currentStyles, style];

    const updatedUser = updateUserProfile({ writingStyles: updatedStyles });
    if (updatedUser) {
      setUser(updatedUser);
      setShowStyleModal(false);
      setNewStyle({ name: '', type: 'text', content: '' });
      onUserUpdate(); // Sync with App
    }
  };

  const removeStyle = (id: string) => {
    if (!user.writingStyles) return;
    const updatedStyles = user.writingStyles.filter(s => s.id !== id);
    const updatedUser = updateUserProfile({ writingStyles: updatedStyles });
    if (updatedUser) {
      setUser(updatedUser);
      onUserUpdate(); // Sync with App
    }
  };

  const handleCancelSubscription = () => {
    const updatedUser = cancelSubscription();
    if (updatedUser) {
      setUser(updatedUser);
      setShowCancelModal(false);
      onUserUpdate();
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 5000); // Clear success message after 5s
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500 relative">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Account Settings</h1>

      {/* Profile Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
            Profile Information
          </h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(false)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <X className="h-4 w-4 mr-1" /> Cancel
              </button>
              <button onClick={handleSaveProfile} className="flex items-center text-sm font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                <Save className="h-4 w-4 mr-1" /> Save
              </button>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 group">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <UserIcon className="h-10 w-10" />
                  </div>
                )}
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    onClick={triggerFileInput}
                    title="Upload Photo"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarFileChange}
              />

              {isEditing && (
                <div className="w-full text-center">
                  <button
                    onClick={triggerFileInput}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center mx-auto"
                  >
                    <Upload className="h-3 w-3 mr-1" /> Upload Photo
                  </button>
                  <div className="mt-2 text-xs text-slate-400">
                    OR
                  </div>
                  <label className="text-xs font-semibold text-slate-500 mt-2 mb-1 block text-left">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 transition ${isEditing ? 'bg-white dark:bg-slate-900 border-brand-300 focus:ring-2 focus:ring-brand-500' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 transition ${isEditing ? 'bg-white dark:bg-slate-900 border-brand-300 focus:ring-2 focus:ring-brand-500' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Lock className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
            Change Password
          </h2>
        </div>
        <div className="p-6">
          <div className="max-w-md space-y-4">
            {/* Success Message */}
            {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center text-green-700 dark:text-green-400">
                <Check className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Password updated successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {passwordError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none transition"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none transition"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none transition"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-lg transition shadow-md flex items-center justify-center"
            >
              <Key className="h-4 w-4 mr-2" />
              Update Password
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Password must be at least 8 characters long. You'll need to log in again after changing your password.
            </p>
          </div>
        </div>
      </div>

      {/* My Writing Style Section (Pro Feature) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Edit2 className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
              My Writing Style
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Teach AI your unique tone by providing examples.</p>
          </div>
          {user.plan !== PlanType.FREE && (
            <button onClick={() => setShowStyleModal(true)} className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center transition">
              <Plus className="h-4 w-4 mr-1" /> Add Style
            </button>
          )}
        </div>
        <div className="p-6">
          {user.plan === PlanType.FREE ? (
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg text-center border border-dashed border-slate-300 dark:border-slate-600">
              <Shield className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">Upgrade to Unlock</h3>
              <p className="text-slate-500 text-sm mb-4">Personalized writing styles are available on Pro plans and above.</p>
              <button onClick={() => navigate('/app/pricing')} className="text-brand-600 font-bold text-sm hover:underline">View Plans</button>
            </div>
          ) : (
            <div className="space-y-4">
              {(user.writingStyles && user.writingStyles.length > 0) ? (
                <div className="grid gap-3">
                  {user.writingStyles.map((style) => (
                    <div key={style.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center text-brand-500 shadow-sm mr-3">
                          {style.sourceType === 'url' ? <LinkIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{style.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{style.content}</p>
                        </div>
                      </div>
                      <button onClick={() => removeStyle(style.id)} className="text-slate-400 hover:text-red-500 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4 italic">No custom styles added yet.</p>
              )}

              {/* Add Style Form Area */}
              {showStyleModal && (
                <div className="mt-4 p-4 border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-900/10 rounded-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-brand-900 dark:text-brand-300">Add New Style</h4>
                    <button onClick={() => setShowStyleModal(false)}><X className="h-4 w-4 text-slate-500" /></button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Style Name (e.g., Casual Blog)"
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      value={newStyle.name}
                      onChange={(e) => setNewStyle({ ...newStyle, name: e.target.value })}
                    />
                    <div className="flex space-x-2 text-sm">
                      <button
                        onClick={() => setNewStyle({ ...newStyle, type: 'text' })}
                        className={`flex-1 py-1.5 rounded border ${newStyle.type === 'text' ? 'bg-white dark:bg-slate-700 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm' : 'border-transparent text-slate-500'}`}
                      >
                        Paste Text
                      </button>
                      <button
                        onClick={() => setNewStyle({ ...newStyle, type: 'url' })}
                        className={`flex-1 py-1.5 rounded border ${newStyle.type === 'url' ? 'bg-white dark:bg-slate-700 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm' : 'border-transparent text-slate-500'}`}
                      >
                        Paste URL
                      </button>
                    </div>
                    <textarea
                      placeholder={newStyle.type === 'url' ? "https://example.com/my-best-article" : "Paste a sample of your writing here..."}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white text-sm h-20 resize-none focus:ring-2 focus:ring-brand-500 outline-none"
                      value={newStyle.content}
                      onChange={(e) => setNewStyle({ ...newStyle, content: e.target.value })}
                    ></textarea>
                    <button
                      onClick={handleAddStyle}
                      className="w-full py-2 bg-brand-600 text-white rounded font-bold text-sm hover:bg-brand-700 transition"
                    >
                      Save Style
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subscription (Existing) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
            Subscription
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.plan === PlanType.PRO
            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
            : user.plan === PlanType.ULTRA || user.plan === PlanType.UNLIMITED
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
            {user.plan} Plan
          </span>
        </div>
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
              You are currently on the <strong>{user.plan}</strong> plan.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs">
              Daily limit: {user.wordLimit === 1000000 ? 'Unlimited' : user.wordLimit} words.
            </p>
          </div>

          {user.plan !== PlanType.FREE ? (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-500 dark:text-red-400 font-medium text-sm hover:underline hover:text-red-700 dark:hover:text-red-300"
            >
              Cancel Subscription
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/pricing')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition shadow-md"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>

      {/* API Key (Mock) */}
      {user.plan !== PlanType.FREE && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Key className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
              API Access
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your secret API key.</p>
            <div className="flex">
              <input type="text" value="sk_live_xxxxxxxxxxxxxxxxxxxx" disabled className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-l-lg px-4 py-2 text-slate-500 dark:text-slate-400 font-mono text-sm" />
              <button className="bg-white dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-600 rounded-r-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600">Copy</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button className="text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition">Delete Account</button>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Cancel Subscription?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              Are you sure you want to cancel? You will lose access to premium features like higher word limits and custom writing styles at the end of your billing cycle.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;