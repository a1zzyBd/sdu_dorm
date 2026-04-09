import React, { useState } from 'react';
import { StudentInfo } from './StudentInfo';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import type { StudentInfoProps } from './StudentInfo';
import api from '../api/backendAPI';


export const SettingsPage: React.FC<StudentInfoProps> = ({ studentData }) => {
  const { user } = useAuth();
  const isCoordinator = user?.access === 'coordinator';
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Block access for blocked students
  if (!isCoordinator && user?.account_status === 'blocked') {
    return <BlockedAccountWarning />;
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.profile.changePassword(passwords.current, passwords.new);

      if (response.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setPasswordError(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordError('Server error. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="text-base text-gray-500">Student account</span>
          <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h1>
        </div>
        <StudentInfo studentData={studentData} />
      </div>

      {/* Password Section */}
      <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Password:</h2>
        <div className="space-y-4 max-w-md">
            
            {/* Current password */}
            <div className="flex items-center">
            <label className="text-sm text-gray-700 w-40 text-right pr-4">
                Current password:
            </label>
            <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                className="w-64 h-8 px-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C97C4B]"
            />
            </div>

            {/* New password */}
            <div className="flex items-start">
            <label className="text-sm text-gray-700 w-40 text-right pr-4">
                New password:
            </label>
            <div className="flex flex-col items-start">
                <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
                className="w-64 h-8 px-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C97C4B]"
                />
                <span className="text-xs text-gray-500 mt-1 ml-1">
                Password should have at least 8 characters.
                </span>
            </div>
            </div>

            {/* Confirm password */}
            <div className="flex items-center">
            <label className="text-sm text-gray-700 w-40 text-right pr-4">
                New password (again):
            </label>
            <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                disabled={changingPassword}
                className="w-64 h-8 px-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C97C4B] disabled:opacity-50"
            />
            </div>

            {/* Button */}
            <div className="text-right mt-3 ml-[calc(40px+10rem)]">
            <button 
                onClick={handlePasswordSubmit}
                disabled={changingPassword}
                className="bg-[#F0B88D] text-black text-sm font-semibold px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {changingPassword ? 'Changing...' : 'Change'}
            </button>
            </div>

            {/* Success/Error Messages */}
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                {passwordError}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
