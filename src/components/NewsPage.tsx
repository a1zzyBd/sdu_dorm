import React from 'react';
import { EyeIcon, HeartIcon } from './Icons';
import { StudentInfo } from './StudentInfo';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import type { StudentInfoProps } from './StudentInfo';

const NewsCard: React.FC<{ imgSrc: string; date: string; views: number; likes: number; className?: string }> = ({ imgSrc, date, views, likes, className }) => (
  <div className="flex flex-col items-center">
    <img src={imgSrc} alt="News" className={`rounded-lg shadow-lg object-cover ${className || ''}`} />
    <div className="flex justify-between w-full text-xs text-gray-500 mt-2 px-1">
      <span>{date}</span>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><EyeIcon className="w-4 h-4" />{views}</span>
        <span className="flex items-center gap-1"><HeartIcon className="w-4 h-4" />{likes}</span>
      </div>
    </div>
  </div>
);

export const NewsPageContent: React.FC<StudentInfoProps> = ({ studentData }) => {
  const { user } = useAuth();
  const isCoordinator = user?.access === 'coordinator';

  // Block access for blocked students
  if (!isCoordinator && user?.account_status === 'blocked') {
    return <BlockedAccountWarning />;
  }

  return (
    <div className="text-[#3a2f2f]">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-base text-gray-500">Student account</span>
          <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>News Page</h1>
        </div>
        <StudentInfo studentData={studentData} />
      </div>

      <div className="flex justify-between items-center px-10 gap-1 mb-12">
        <NewsCard
            imgSrc="/firstimage.png"
            date="17 am, 26 sept"
            views={513}
            likes={208}
            className="w-[400px] h-[450px] rounded-none"
        />
        <NewsCard
            imgSrc="/middleimage.png"
            date="11 pm, Today"
            views={280}
            likes={98}
            className="w-[600px] h-[700px] rounded-none"
        />
        <NewsCard
            imgSrc="/lastimage.png"
            date="6 am, 18 oct"
            views={143}
            likes={57}
            className="w-[400px] h-[450px] rounded-none"
        />
     </div>


      {/* Volleyball Cup Details */}
      <div className="bg-[#493E58] text-[#DDB98F] p-12 rounded-3xl flex flex-col items-center text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>VOLLEYBALL CUP 2025!</h2>
        <p className="text-xl mb-6">Girls, are you ready? 🔥</p>
        <p className="text-lg max-w-2xl mb-6">
          Join the Volleyball Tournament organized by the Girls' Dormitory on October 30th and compete with your team for victory! 🏐✨
        </p>
        <div className="text-white text-left self-start max-w-2xl mx-auto mb-8 w-full">
            <p className="font-bold mb-2">Participation requirements:</p>
            <p className="pl-4">· Each team must have 6–8 players.</p>
        </div>
        <a href="#" className="bg-[#D5A980] text-[#493E58] px-6 py-3 rounded-lg font-semibold block text-left shadow-md">
          <span className="block">📋 Registration form:</span>
          <span className="underline">Click here to register</span>
        </a>
      </div>
      
    </div>
  );
};
