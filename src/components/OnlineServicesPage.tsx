import React, { useState, useEffect } from 'react';
import { StudentInfo } from './StudentInfo';
import { SendIcon } from './Icons';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/backendAPI';
import type { StudentInfoProps } from './StudentInfo';

interface Explanation {
  id: number;
  student_id: string;
  student_name?: string;
  explanation_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
}

interface ExportFile {
  filename: string;
  downloadUrl: string;
  createdAt: string;
}

// Export reports component (for coordinator only)
const ExportReportsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'get-export' | 'exports'>('get-export');
  const [block, setBlock] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportHistory, setExportHistory] = useState<ExportFile[]>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('exportHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('exportHistory', JSON.stringify(exportHistory));
  }, [exportHistory]);

  const handleDownloadReport = async () => {
    if (!dateFrom || !dateTo) {
      setExportError('Please select both dates');
      return;
    }

    setExporting(true);
    setExportError('');

    try {
      const response = await api.reports.exportViolations(block, dateFrom, dateTo);
      
      if (response.success) {
        // File already downloaded by API, add to history
        const blockPrefix = block === 'all' ? 'all_blocks' : `${block}_block`;
        const filename = `${blockPrefix}_violations_from_${dateFrom}_to_${dateTo}.csv`;
        
        setExportHistory(prev => [{
          filename,
          downloadUrl: '#',
          createdAt: new Date().toISOString().split('T')[0]
        }, ...prev]);
      } else {
        setExportError(response.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Server error. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab('get-export')}
          className={`px-6 py-2.5 font-semibold transition-colors -mb-px ${
            activeTab === 'get-export'
              ? 'bg-white text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg'
              : 'bg-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Get Export
        </button>
        <button
          onClick={() => setActiveTab('exports')}
          className={`px-6 py-2.5 font-semibold transition-colors -mb-px ${
            activeTab === 'exports'
              ? 'bg-white text-gray-800 border-t border-l border-r border-gray-300 rounded-t-lg'
              : 'bg-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Exports
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-300 border-t-0 rounded-b-lg p-6">
        {/* Error Message */}
        {exportError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {exportError}
          </div>
        )}

        {/* Get Export Tab */}
        {activeTab === 'get-export' && (
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2.5 pr-5 font-semibold text-gray-700 align-top w-56">
                    Dormitory Block
                  </td>
                  <td className="py-2.5">
                    <select
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C97C4B]"
                    >
                      <option value="all">All blocks</option>
                      <option value="a">Block A</option>
                      <option value="b">Block B</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-5 font-semibold text-gray-700 align-top">
                    Date Range (From - To)
                  </td>
                  <td className="py-2.5">
                    <div className="flex gap-2.5">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C97C4B]"
                      />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C97C4B]"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={handleDownloadReport}
              disabled={!dateFrom || !dateTo || exporting}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {exporting ? 'Downloading...' : 'Download Report'}
            </button>
          </div>
        )}

        {/* Exports Tab */}
        {activeTab === 'exports' && (
          <div>
            {exportHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No export history yet.</p>
            ) : (
              <ul className="space-y-0">
                {exportHistory.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 py-3 px-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <a
                      href={file.downloadUrl}
                      download={file.filename}
                      className="font-mono text-sm text-gray-700 hover:text-[#C97C4B] hover:underline"
                    >
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Student component - Explanation submission form
const StudentExplanationForm: React.FC<StudentInfoProps> = ({ studentData }) => {
  const [explanationText, setExplanationText] = useState('');
  const [myExplanations, setMyExplanations] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if there's a pending explanation
  const hasPending = myExplanations.some(exp => exp.status === 'pending');

  // Load my explanations
  useEffect(() => {
    fetchMyExplanations();
  }, []);

  const fetchMyExplanations = async () => {
    try {
      const data = await api.explanations.getMyExplanations();
      if (data.success) {
        setMyExplanations(data.data as any);
      }
    } catch (err) {
      console.error('Error fetching explanations:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanationText.trim()) {
      setError('Please enter explanation text');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.explanations.submitExplanation(explanationText);

      if (data.success) {
        setSuccess('Explanation submitted successfully!');
        setExplanationText('');
        fetchMyExplanations(); // Refresh list
      } else {
        setError(data.error || 'Failed to submit explanation');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-red-600 bg-red-100';
      case 'rejected': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Under Review';
      case 'approved': return 'Violation Confirmed';
      case 'rejected': return 'Dismissed';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-base text-gray-500">Student services</span>
          <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Online Services</h1>
        </div>
        <StudentInfo studentData={studentData} />
      </div>

      {/* Explanation notes section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Explanation Note</h2>

      {/* Explanation submission form */}
      <div className="bg-[#E6E1DB] p-6 rounded-2xl mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-400">Submit New Explanation</h3>
        
        {hasPending && (
          <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="text-sm font-semibold">⚠️ You already have a pending explanation under review.</p>
            <p className="text-xs mt-1">Please wait for coordinator's decision before submitting a new one.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Explanation Note:
          </label>
          <textarea
            value={explanationText}
            onChange={(e) => setExplanationText(e.target.value)}
            disabled={loading || hasPending}
            placeholder="Please provide a detailed explanation of the situation..."
            className="w-full h-40 p-4 border-2 border-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#C97C4B] disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Be honest and detailed in your explanation. The coordinator will review your submission.
            </p>
            <button
              type="submit"
              disabled={loading || hasPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#C97C4B] text-white rounded-lg hover:bg-[#B06A39] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <SendIcon className="h-5 w-5" />
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* My explanation history */}
      <div className="bg-[#E6E1DB] p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-400">My Explanation History</h3>
        
        {myExplanations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No explanation notes submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {myExplanations.map((exp) => (
              <div key={exp.id} className="border-2 border-gray-400 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(exp.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                    {getStatusText(exp.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">
                  {exp.explanation_text}
                </p>
                {exp.reviewed_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed: {new Date(exp.reviewed_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Coordinator component - Explanation review panel
const CoordinatorReviewPanel: React.FC<StudentInfoProps> = ({ studentData }) => {
  const [pendingExplanations, setPendingExplanations] = useState<Explanation[]>([]);
  const [reviewedExplanations, setReviewedExplanations] = useState<Explanation[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExplanations();
  }, []);

  const fetchExplanations = async () => {
    try {
      // Fetch pending
      const pendingData = await api.explanations.getPendingExplanations();
      if (pendingData.success) {
        setPendingExplanations(pendingData.data as any);
      }

      // Fetch reviewed
      const reviewedData = await api.explanations.getReviewedExplanations();
      if (reviewedData.success) {
        setReviewedExplanations(reviewedData.data as any);
      }
    } catch (err) {
      console.error('Error fetching explanations:', err);
    }
  };

  const handleReview = async (explanationId: number, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this explanation?`)) {
      return;
    }

    setLoading(true);
    try {
      const data = action === 'approve' 
        ? await api.explanations.approveExplanation(explanationId)
        : await api.explanations.rejectExplanation(explanationId);
      
      if (data.success) {
        alert(`Explanation ${action}ed successfully!`);
        fetchExplanations(); // Refresh lists
      } else {
        alert(`Failed to ${action} explanation`);
      }
    } catch (err) {
      alert('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-red-600 bg-red-100';
      case 'rejected': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-base text-gray-500">Coordinator panel</span>
          <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Review Explanation Notes</h1>
        </div>
        <StudentInfo studentData={studentData} />
      </div>

      {/* Export reports module (coordinator only) */}
      <ExportReportsSection />

      <hr className="border-0 h-px bg-gray-300 my-10" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'pending'
              ? 'bg-[#C97C4B] text-white'
              : 'bg-[#E6E1DB] text-gray-800 hover:bg-[#D4CEC5]'
          }`}
        >
          Pending Review ({pendingExplanations.length})
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'reviewed'
              ? 'bg-[#C97C4B] text-white'
              : 'bg-[#E6E1DB] text-gray-800 hover:bg-[#D4CEC5]'
          }`}
        >
          Reviewed ({reviewedExplanations.length})
        </button>
      </div>

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="bg-[#E6E1DB] p-6 rounded-2xl">
          {pendingExplanations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending explanations to review.</p>
          ) : (
            <div className="space-y-4">
              {pendingExplanations.map((exp) => (
                <div key={exp.id} className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{exp.student_name || exp.student_id}</p>
                      <p className="text-xs text-gray-600">Student ID: {exp.student_id}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(exp.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-300 mb-3">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {exp.explanation_text}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(exp.id, 'approve')}
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                    >
                      ✓ Confirm Violation
                    </button>
                    <button
                      onClick={() => handleReview(exp.id, 'reject')}
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      ✗ Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviewed Tab */}
      {activeTab === 'reviewed' && (
        <div className="bg-[#E6E1DB] p-6 rounded-2xl">
          {reviewedExplanations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviewed explanations yet.</p>
          ) : (
            <div className="space-y-4">
              {reviewedExplanations.map((exp) => (
                <div key={exp.id} className="border-2 border-gray-400 bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-800">{exp.student_name || exp.student_id}</p>
                      <p className="text-xs text-gray-600">Student ID: {exp.student_id}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Reviewed: {exp.reviewed_at && new Date(exp.reviewed_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                      {exp.status === 'approved' ? 'Violation Confirmed' : 'Dismissed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    {exp.explanation_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main component with mode switching
export const OnlineServicesPage: React.FC<StudentInfoProps> = ({ studentData }) => {
  const { isCoordinator, user } = useAuth();

  // Block access for blocked students
  if (!isCoordinator && user?.account_status === 'blocked') {
    return <BlockedAccountWarning />;
  }

  if (isCoordinator) {
    return <CoordinatorReviewPanel studentData={studentData} />;
  } else {
    return <StudentExplanationForm studentData={studentData} />;
  }
};

