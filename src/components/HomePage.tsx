import React, { useState, useEffect } from 'react';
import { HomeIcon, NewsIcon, RoomTrackingIcon, RulesIcon, OnlineServicesIcon, SettingsIcon, UserIcon, SignOutIcon, DormitoryWarningIcon } from './Icons';
import { NewsPageContent } from './NewsPage';
import { RoomTrackingPage } from './RoomTrackingPage';
import { RulesAndRegulationsPage } from './RulesAndRegulationsPage';
import { OnlineServicesPage } from './OnlineServicesPage';
import { SettingsPage } from './SettingsPage';
import { MyProfilePage } from './MyProfilePage';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/backendAPI';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const NavLink: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; isFirst?: boolean; onClick?: () => void }> = ({ icon, label, active = false, isFirst = false, onClick }) => {
  const baseClasses = "flex items-center space-x-2 p-[10px] cursor-pointer text-[#3a2f2f] text-[15px] transition-colors duration-200 border-t border-gray-400";
  const activeClasses = "bg-[#d8b68c] font-semibold border-gray-600";
  const inactiveClasses = "bg-[#f3ede4] hover:bg-[#ffffff]";
  const firstItemClass = isFirst ? "border-t-0" : "";

  return (
    <a onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${firstItemClass}`}>
      {icon}
      <span>{label}</span>
    </a>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activePage, setActivePage] = useState('home');
  const { user, isCoordinator, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load profile data from backend on mount and when returning to home
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.profile.getProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [activePage]); // Reload when page changes

  const handleSignOut = () => {
    api.auth.logout();
    logout();
    onNavigate('home');
  };

  const renderContent = () => {
    if (!user) return null; // Guard clause
    
    // Show loading state while fetching profile
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8c7a66] text-lg">Loading profile...</div>
        </div>
      );
    }

    // Check if account is blocked (only for students, not coordinators)
    if (!isCoordinator && user.account_status === 'blocked') {
      return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
    }
    
    // Use profile data from backend if available, otherwise use user context
    const backendData = profileData || {};

    const studentData = {
      studentNo: backendData.student_id || user.student_id,
      fullName: backendData.fullname || user.fullname,
      profession: backendData.specialty || user.specialty,
      course: backendData.course || user.course,  // Already a string now
      room: backendData.room || user.room || 'B405(special room)',
      email: backendData.email || user.email, 
      universityEmail: backendData.university_email || user.email,
      personalEmail: backendData.personal_email,
      birthDate: backendData.birthdate || user.birthdate,
      citizenship: 'Kazakhstan',
      iin: backendData.iin || '',
      iban: backendData.iban || '',
      docType: backendData.doc_type || '',
      docNo: backendData.doc_number || '',
      docAuth: 'Ministry of Internal Affairs',
      docIssueDate: backendData.doc_issue_date || '',
      address: backendData.local_address || '',
      school: backendData.school || 'SDU University',
      // Coordinator fields
      status: backendData.status,
      degree: backendData.degree,
      specialRoom: backendData.special_room,
    };

    switch (activePage) {
      case 'news':
        // Block access for blocked accounts (except coordinator)
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <NewsPageContent studentData={studentData} />;
      case 'room':
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <RoomTrackingPage studentData={studentData} />;
      case 'rules':
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <RulesAndRegulationsPage studentData={studentData} />;
      case 'services':
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <OnlineServicesPage studentData={studentData} />;
      case 'settings':
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <SettingsPage studentData={studentData} />;
      case 'profile':
        if (!isCoordinator && user.account_status === 'blocked') {
          return <BlockedAccountWarning coordinatorEmail="coordinator@sdu.edu.kz" />;
        }
        return <MyProfilePage studentData={studentData} />;
      case 'home':
      default:
        return (
          <>

            <span className="text-sm text-[#8c7a66]">
              {isCoordinator ? 'Coordinator account' : 'Student account'}
            </span>
            <h1 className="text-[26px] font-serif text-[#a25f2a] mt-1 mb-6">Home page</h1>
            <div className="flex flex-row items-start gap-4">
              <div className="shrink-0">
                  <img 
                      src="/userprofile.png" 
                      alt="Student profile" 
                      className="rounded-lg shadow-md border-4 border-[#fffaf4] object-cover w-[100px] sm:w-[150px] lg:w-[200px]"
                    />
              </div>
              <table className="border-collapse bg-[#fffaf4] w-auto">
                  <tbody>
                    {Object.entries({
                      "Student Nº": studentData.studentNo,
                      "Fullname": studentData.fullName,
                      "Birth date": studentData.birthDate,
                      "Profession": studentData.profession,
                      "Course": studentData.course,
                      "Email": studentData.universityEmail,
                      "Room": studentData.room,
                    }).map(([label, value]) => (
                      <tr key={label}>
                        <td className="border border-[#ddd2c0] py-2 px-4 sm:py-2.5 sm:px-4 whitespace-nowrap text-right">{label}:</td>
                        <td className="border border-[#ddd2c0] py-2 px-8 sm:py-2.5 sm:px-8 font-bold text-[#3a2d26]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>

            {!isCoordinator && user && user.violation_count > 0 && user.account_status !== 'blocked' && (
              <div className="mt-8 rounded-lg shadow-md max-w-4xl">
                <div style={{backgroundColor: user.violation_count >= 3 ? '#dc2626' : '#e8605d'}} className="text-white p-3 flex items-center gap-3 rounded-t-lg">
                  <DormitoryWarningIcon className="w-5 h-5 shrink-0" />
                  <h2 className="font-bold text-[16px]">
                    {user.violation_count >= 3 ? 'ACCOUNT BLOCKED!' : 'Dormitory notice!'}
                  </h2>
                </div>
                <div className="bg-[#fdf2e2] p-4 rounded-b-lg text-sm text-[#3a2f2f] space-y-3">
                  <div className="space-y-1">
                    <p>You currently have <strong className="font-bold">{user.violation_count} explanation note{user.violation_count > 1 ? 's' : ''}</strong> on record.</p>
                    {user.violation_count >= 3 ? (
                      <p className="text-red-600 font-bold">Your account has been suspended for reaching the limit of three policy violations.</p>
                    ) : (
                      <p>If you reach <strong className="font-bold">3 explanation notes</strong>, your dormitory access may be revoked.</p>
                    )}
                  </div>
                  <div style={{backgroundColor: user.violation_count >= 3 ? '#fee2e2' : '#feeec8'}} className="text-[#3a2f2f] p-2 rounded-md flex items-center gap-2 text-xs">
                    <span style={{color: user.violation_count >= 3 ? '#dc2626' : '#E59400'}} className="font-bold text-lg leading-none">!</span>
                    <p>
                      {user.violation_count >= 3 
                        ? 'Please have your parents contact coordinator@sdu.edu.kz for further assistance.'
                        : 'Please check "Online Services" for more details or contact the coordinator.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-[#f3ede4] min-h-screen text-[#3a2f2f] font-sans flex flex-row px-5">
      {/* Left Sidebar */}
      <aside className="w-[230px] py-5 px-2.5 shrink-0 h-screen overflow-y-auto">
          <img src="/sduDor.png" alt="SDU Dorm Logo" className="w-[90px] mx-auto mb-5" />
          
          <div className="border border-gray-400 bg-[#e6e1db]">
            <NavLink icon={<HomeIcon className="h-5 w-5" />} label="Home page" active={activePage === 'home'} onClick={() => setActivePage('home')} isFirst />
          </div>
          
          <h3 className="text-[13px] text-[#7b6d61] mt-[15px] mb-2 mx-2.5 uppercase font-bold">Information</h3>
          <div className="border border-gray-400 bg-[#e6e1db]">
              <NavLink icon={<NewsIcon className="h-5 w-5" />} label="News page" active={activePage === 'news'} onClick={() => setActivePage('news')} isFirst/>
              <NavLink icon={<RoomTrackingIcon className="h-5 w-5" />} label="Room tracking" active={activePage === 'room'} onClick={() => setActivePage('room')}/>
              <NavLink icon={<RulesIcon className="h-5 w-5" />} label="Rules and Regulations" active={activePage === 'rules'} onClick={() => setActivePage('rules')}/>
              <NavLink icon={<OnlineServicesIcon className="h-5 w-5" />} label="Online Services" active={activePage === 'services'} onClick={() => setActivePage('services')}/>
          </div>

          <h3 className="text-[13px] text-[#7b6d61] mt-[15px] mb-2 mx-2.5 uppercase font-bold">Profile</h3>
          <div className="border border-gray-400 bg-[#e6e1db]">
              <NavLink icon={<SettingsIcon className="h-5 w-5" />} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} isFirst/>
              <NavLink icon={<UserIcon className="h-5 w-5" />} label="My profile" active={activePage === 'profile'} onClick={() => setActivePage('profile')}/>
              <NavLink icon={<SignOutIcon className="h-5 w-5" />} label="[ Sign out ]" onClick={handleSignOut} />
          </div>
      </aside>

      {/* Right Content Area */}
      <main className="grow p-[30px_40px] flex flex-col min-h-screen">
      <div className="grow">
        {renderContent()}
      </div>
      <footer className="text-[13px] text-[#8c7a66] mt-auto text-right">
        SDU Dorm © 2025
      </footer>
    </main>
    </div>
  );
};