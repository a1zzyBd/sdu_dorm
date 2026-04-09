import React, { useState } from 'react';
import { StudentInfo } from './StudentInfo';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/backendAPI';

interface ProfileData {
  fullName: string;
  room: string;
  course: string;
  profession: string;
  studentNo: string;
  email: string;
  universityEmail: string;
  personalEmail?: string;  // New: personal email
  birthDate: string;
  citizenship: string;
  iin: string;
  iban:string;
  docType: string;
  docNo: string;
  docAuth: string;
  docIssueDate: string;
  address: string;
  school: string;
  // Coordinator fields
  status?: string;
  degree?: string;
  specialRoom?: string;
}

interface MyProfilePageProps {
  studentData: ProfileData;
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}> = ({ label, value, isEditing = false, onChange, name }) => (
    <div className="grid grid-cols-[200px_1fr] py-2.5 items-center text-sm border-b border-[#D1C6B8]">
        <span className="font-bold text-[#3A2F2F]">{label}:</span>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="bg-white/80 border border-gray-400 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#C97C4B]"
            />
        ) : (
             <span className="text-[#3A2F2F]">{value}</span>
        )}
    </div>
);


export const MyProfilePage: React.FC<MyProfilePageProps> = ({ studentData }) => {
    const { user } = useAuth();
    const isCoordinator = user?.access === 'coordinator';
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState<ProfileData>(studentData);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Block access for blocked students
    if (!isCoordinator && user?.account_status === 'blocked') {
        return <BlockedAccountWarning />;
    }
    
    const profileFields: { label: string, key: keyof ProfileData, readOnly?: boolean }[] = [
        { label: 'FullName', key: 'fullName', readOnly: true },
        { label: 'University Email', key: 'universityEmail', readOnly: true },
        { label: 'Personal Email', key: 'personalEmail', readOnly: true },
        { label: 'Birth date', key: 'birthDate', readOnly: true },
        { label: 'Citizenship', key: 'citizenship', readOnly: true },
        { label: 'School', key: 'school', readOnly: true },
        { label: 'IIN no', key: 'iin' },  // Editable
        { label: 'IBAN no', key: 'iban' },  // Editable
        { label: 'Document type', key: 'docType' },  // Editable
        { label: 'Document no', key: 'docNo' },  // Editable
        { label: 'Document authority', key: 'docAuth', readOnly: true },
        { label: 'Document issue date', key: 'docIssueDate' },  // Editable
        { label: 'Local Address', key: 'address' },  // Editable
    ];
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditableData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
    
    const handleSave = async () => {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      
      try {
        // Send only editable fields to backend
        const response = await api.profile.updateProfile({
          iin: editableData.iin,
          iban: editableData.iban,
          doc_type: editableData.docType,
          doc_number: editableData.docNo,
          doc_issue_date: editableData.docIssueDate,
          local_address: editableData.address,
        });
        
        if (response.success) {
          setSuccessMessage('Profile updated successfully!');
          setIsEditing(false);
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.error || 'Failed to update profile');
        }
      } catch (err) {
        console.error('Save profile error:', err);
        setError('Server error. Please try again.');
      } finally {
        setSaving(false);
      }
    };

    const handleCancel = () => {
      setEditableData(studentData); // Revert changes
      setIsEditing(false);
      setError('');
      setSuccessMessage('');
    };


    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                <span className="text-base text-gray-500">Student account</span>
                <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>My Profile</h1>
                </div>
                <StudentInfo studentData={studentData} />
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Main Content Area */}
            <div className="mt-12">
                <div>
                    <div className="bg-[#F0B88D] text-black text-sm font-semibold px-6 py-2 rounded-t-lg border-t-2 border-l-2 border-r-2 border-[#b5a899] inline-block">
                        My info
                    </div>
                </div>
                
                <div className="border-2 border-[#b5a899] rounded-b-lg rounded-tr-lg p-8 bg-[#EAE6E1] -mt-0.5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Main Data</h3>
                    
                    <div className="bg-[#E6E1DB] px-6 py-2 rounded-md">
                        {profileFields.map(({ label, key, readOnly }) => (
                           <InfoRow 
                                key={key} 
                                label={label} 
                                value={editableData[key] || ''}  // Handle optional fields
                                isEditing={isEditing && !readOnly}  // Don't allow editing read-only fields
                                onChange={handleInputChange}
                                name={key}
                            />
                        ))}
                    </div>

                    <div className="mt-6">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    className="bg-[#65b16c] text-white text-sm font-semibold px-8 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button 
                                    onClick={handleCancel} 
                                    disabled={saving}
                                    className="bg-[#d9534f] text-white text-sm font-semibold px-8 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="bg-[#F0B88D] text-black text-sm font-semibold px-8 py-2 rounded-md hover:bg-opacity-90">
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
