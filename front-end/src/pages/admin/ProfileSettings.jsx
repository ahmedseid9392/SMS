import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Save, Key, Bell, 
  Eye, EyeOff, CheckCircle, XCircle, Shield, Briefcase, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import CloudinaryUpload from '../../components/ui/CloudinaryUpload';
import api from '../../api/axios';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    department: '',
    position: '',
    joinDate: '',
    profilePicture: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        department: user.department || 'Administration',
        position: user.position || 'Administrator',
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const checkPasswordStrength = (password) => {
    const strength = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    let score = 0;
    Object.values(strength).forEach(value => {
      if (value) score++;
    });
    
    let message = '';
    if (score <= 2) message = 'Weak';
    else if (score <= 4) message = 'Medium';
    else message = 'Strong';
    
    setPasswordStrength({ ...strength, score, message });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const handleProfilePictureUpload = (url) => {
    setProfileForm({ ...profileForm, profilePicture: url });
    // Also update the user context immediately
    updateUser({ profilePicture: url });
  };

  const handleRemoveProfilePicture = () => {
    setProfileForm({ ...profileForm, profilePicture: '' });
    updateUser({ profilePicture: '' });
  };

  const saveProfileSettings = async () => {
    if (!profileForm.fullName) {
      toast.error('Full name is required');
      return;
    }
    
    setSaving(true);
    try {
      const response = await api.put('/auth/admin/profile', profileForm);
      if (response.data.success) {
        // Update user context with new data
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordForm.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (!passwordForm.newPassword) {
      toast.error('New password is required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordStrength.score < 4) {
      toast.error('Please use a stronger password');
      return;
    }
    
    setSaving(true);
    try {
      const response = await api.post('/auth/admin/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage your profile and account preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl shadow-lg overflow-hidden sticky top-24"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                    <User size={18} className="inline mr-3" />
                    Profile Information
                  </div>
                  <div className="px-4 py-3 rounded-xl text-gray-500">
                    <Key size={18} className="inline mr-3" />
                    Security
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Information */}
            <div className="rounded-2xl shadow-lg overflow-hidden"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User size={20} />
                  Profile Information
                </h2>
              </div>
              
              <div className="p-6">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <CloudinaryUpload
                    onUploadSuccess={handleProfilePictureUpload}
                    currentImage={profileForm.profilePicture}
                    onRemove={handleRemoveProfilePicture}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profileForm.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={profileForm.position}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={profileForm.joinDate}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <textarea
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      rows="2"
                      className="w-full px-4 py-2 rounded-xl resize-none"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 rounded-xl resize-none"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={saveProfileSettings}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                             transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl shadow-lg overflow-hidden"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Key size={20} />
                  Change Password
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 pr-10 rounded-xl"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 pr-10 rounded-xl"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1 rounded-full bg-gray-200">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                passwordStrength.score <= 2 ? 'bg-red-500 w-1/3' :
                                passwordStrength.score <= 4 ? 'bg-yellow-500 w-2/3' :
                                'bg-green-500 w-full'
                              }`}
                            />
                          </div>
                          <span className={`text-xs ${
                            passwordStrength.score <= 2 ? 'text-red-500' :
                            passwordStrength.score <= 4 ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            {passwordStrength.message}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordStrength.hasMinLength ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            Min 8 characters
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordStrength.hasUpperCase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            Uppercase letter
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordStrength.hasLowerCase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            Lowercase letter
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordStrength.hasNumber ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            Number
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                            {passwordStrength.hasSpecialChar ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            Special character
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                    {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={changePassword}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                             transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Key size={18} />
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;