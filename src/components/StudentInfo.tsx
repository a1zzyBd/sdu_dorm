import React from 'react';

export interface StudentInfoProps {
  studentData: {
    studentNo: string;
    fullName: string;
    profession: string;
    course: string;
    room: string;
    status?: string;  // For coordinator
    degree?: string;  // For coordinator
    specialRoom?: string;  // For coordinator
  };
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ studentData }) => {
  const isCoordinator = studentData.status || studentData.degree || studentData.specialRoom;
  
  return (
    <div className="p-4 rounded-lg font-mono flex items-center justify-between gap-4">
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm text-[#3a2f2f]">
        <span className="text-right">Fullname:</span>
        <span className="font-bold">{studentData.fullName}</span>
        
        {isCoordinator ? (
          <>
            {studentData.status && (
              <>
                <span className="text-right">Status:</span>
                <span className="font-bold">{studentData.status}</span>
              </>
            )}
            {studentData.degree && (
              <>
                <span className="text-right">Degree:</span>
                <span className="font-bold">{studentData.degree}</span>
              </>
            )}
            {studentData.specialRoom && (
              <>
                <span className="text-right">Room:</span>
                <span className="font-bold">{studentData.specialRoom}</span>
              </>
            )}
          </>
        ) : (
          <>
            <span className="text-right">Room:</span>
            <span className="font-bold">{studentData.room}</span>

            <span className="text-right">Course:</span>
            <span className="font-bold">{studentData.course}</span>
            
            <span className="text-right">Profession:</span>
            <span className="font-bold">{studentData.profession}</span>
          </>
        )}
        
        <span className="text-right">Student Nº:</span>
        <span className="font-bold">{studentData.studentNo}</span>
      </div>
      <img
        src="/userprofile.png"
        alt="Student profile"
        className="w-[85px] h-[100px] object-cover rounded-lg shadow-md border border-gray-300"
      />
    </div>
  );
};
