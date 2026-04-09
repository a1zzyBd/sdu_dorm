import React, { useState, useEffect } from 'react';
import { StudentInfo } from './StudentInfo';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/backendAPI';
import type { StudentInfoProps } from './StudentInfo';

interface RoomData {
  room_number: string;
  block: 'A' | 'B';
  current_occupancy: number;
  max_capacity: number;
  gender?: 'male' | 'female';
  status?: 'active' | 'maintenance';
  residents?: string[]; // student_ids
}

interface Student {
  student_id: string;
  fullname: string;
  room: string | null;
  gender?: string;
}

// Компонент отображения комнаты для студента (readonly)
const RoomCardStudent: React.FC<{ room: RoomData }> = ({ room }) => {
  const occupancyPercent = (room.current_occupancy / room.max_capacity) * 100;
  let bgColor = 'bg-green-500'; // 0-1 places
  if (occupancyPercent >= 75) bgColor = 'bg-red-500'; // 3-4 places
  else if (occupancyPercent >= 50) bgColor = 'bg-yellow-500'; // 2 places

  return (
    <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white text-xs font-semibold ${bgColor} shadow`}>
      <div className="text-[10px] mb-1">{room.room_number}</div>
      <div className="text-sm font-bold">{room.current_occupancy}/{room.max_capacity}</div>
    </div>
  );
};

// Компонент отображения комнаты для координатора (clickable)
const RoomCardCoordinator: React.FC<{ room: RoomData; onClick: () => void }> = ({ room, onClick }) => {
  const occupancyPercent = (room.current_occupancy / room.max_capacity) * 100;
  let bgColor = 'bg-green-500';
  if (occupancyPercent >= 75) bgColor = 'bg-red-500';
  else if (occupancyPercent >= 50) bgColor = 'bg-yellow-500';

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white text-xs font-semibold ${bgColor} shadow hover:ring-4 hover:ring-[#C97C4B] transition-all`}
    >
      <div className="text-[10px] mb-1">{room.room_number}</div>
      <div className="text-sm font-bold">{room.current_occupancy}/{room.max_capacity}</div>
    </button>
  );
};

// Модальное окно для управления комнатой
const RoomManagementModal: React.FC<{
  room: RoomData;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ room, onClose, onUpdate }) => {
  const [residents, setResidents] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
    fetchUnassignedStudents();
  }, [room.room_number]);

  const fetchRoomDetails = async () => {
    try {
      const data = await api.rooms.getRoomResidents(room.room_number);
      console.log('Room residents response:', data);
      
      if (data.success && data.data) {
        console.log('Residents data:', data.data);
        // Transform the data: extract student object from room assignment
        const transformedResidents = data.data.map((assignment: any) => assignment.student);
        console.log('Transformed residents:', transformedResidents);
        setResidents(transformedResidents);
      }
    } catch (err) {
      console.error('Error fetching residents:', err);
    }
  };

  const fetchUnassignedStudents = async () => {
    try {
      // Get room gender for filtering
      const roomGender = room.gender || (room.block === 'A' ? 'male' : 'female');
      const data = await api.students.getUnassignedStudents(roomGender);
      if (data.success && data.data) {
        setUnassignedStudents(data.data as any);
      }
    } catch (err) {
      console.error('Error fetching unassigned students:', err);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    console.log('Removing student:', studentId, 'from room:', room.room_number);
    
    if (!studentId || !room.room_number) {
      alert('Invalid student ID or room number');
      return;
    }
    
    if (!confirm(`Remove student ${studentId} from room ${room.room_number}?`)) {
      return;
    }

    setLoading(true);
    try {
      const data = await api.roomAssignments.removeFromRoom(studentId, room.room_number);
      console.log('Remove response:', data);
      
      if (data.success) {
        alert('Student removed successfully');
        fetchRoomDetails();
        fetchUnassignedStudents();
        onUpdate();
      } else {
        alert(data.error || 'Failed to remove student');
      }
    } catch (err) {
      console.error('Remove error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (studentId: string) => {
    if (room.current_occupancy >= room.max_capacity) {
      alert('Room is full!');
      return;
    }

    setLoading(true);
    try {
      const data = await api.roomAssignments.assignRoom(studentId, room.room_number);
      if (data.success) {
        alert('Student assigned successfully');
        fetchRoomDetails();
        fetchUnassignedStudents();
        onUpdate();
      } else {
        alert(data.error || 'Failed to assign student');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#C97C4B]">Room {room.room_number}</h2>
            <p className="text-gray-600">Block {room.block} · Occupancy: {room.current_occupancy}/{room.max_capacity}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Current Residents */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Residents</h3>
          {residents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No residents assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {residents.map((student) => (
                <div key={student.student_id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{student.fullname}</p>
                    <p className="text-xs text-gray-600">ID: {student.student_id}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student.student_id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Student */}
        {room.current_occupancy < room.max_capacity && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Student</h3>
            {unassignedStudents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No unassigned students available.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {unassignedStudents.map((student) => (
                  <div key={student.student_id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-800">{student.fullname}</p>
                      <p className="text-xs text-gray-600">ID: {student.student_id}</p>
                    </div>
                    <button
                      onClick={() => handleAssignStudent(student.student_id)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Главный компонент с переключением режимов
export const RoomTrackingPage: React.FC<StudentInfoProps> = ({ studentData }) => {
  const { isCoordinator, user } = useAuth();
  const [selectedBlock, setSelectedBlock] = useState<'A' | 'B' | null>(null);
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(false);

  // Block access for blocked students
  if (!isCoordinator && user?.account_status === 'blocked') {
    return <BlockedAccountWarning />;
  }

  useEffect(() => {
    if (selectedBlock) {
      fetchRooms(selectedBlock);
    }
  }, [selectedBlock]);

  const fetchRooms = async (block: 'A' | 'B') => {
    setLoading(true);
    try {
      const data = await api.rooms.getRooms(block);
      if (data.success && data.data) {
        setRoomsData(data.data as any);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room: RoomData) => {
    if (isCoordinator) {
      setSelectedRoom(room);
    }
  };

  const handleModalClose = () => {
    setSelectedRoom(null);
  };

  const handleUpdate = () => {
    if (selectedBlock) {
      fetchRooms(selectedBlock);
    }
  };

  // Блок селектор
  if (!selectedBlock) {
    return (
      <div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-base text-gray-500">{isCoordinator ? 'Coordinator panel' : 'Student account'}</span>
            <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Room Tracking</h1>
          </div>
          <StudentInfo studentData={studentData} />
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-3xl font-bold text-[#C97C4B] mb-8">Select Block</h3>
          <div className="flex justify-center gap-16">
            <button
              onClick={() => setSelectedBlock('A')}
              className="w-48 h-48 bg-[#F0B88D] rounded-2xl flex items-center justify-center text-8xl font-bold text-black shadow-lg hover:opacity-90 transition-opacity"
            >
              A
            </button>
            <button
              onClick={() => setSelectedBlock('B')}
              className="w-48 h-48 bg-[#F0B88D] rounded-2xl flex items-center justify-center text-8xl font-bold text-black shadow-lg hover:opacity-90 transition-opacity"
            >
              B
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Просмотр комнат выбранного блока
  const floors = ['3', '4', '5'];
  const roomsByFloor = floors.map(floor => {
    const floorRooms = roomsData.filter(r => r.room_number.startsWith(`${selectedBlock}${floor}`));
    return { floor, rooms: floorRooms };
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-base text-gray-500">{isCoordinator ? 'Coordinator panel' : 'Student account'}</span>
          <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Room Tracking</h1>
        </div>
        <StudentInfo studentData={studentData} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedBlock(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
          <div className="bg-[#F0B88D] text-black font-bold px-6 py-2 rounded-full text-lg">
            BLOCK {selectedBlock}
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>0-1 occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>2 occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>3-4 occupied</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading rooms...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {roomsByFloor.map(({ floor, rooms }) => (
            <div key={floor} className="flex items-start gap-8">
              <div className="w-20 text-right font-semibold text-gray-700 mt-4">Floor {floor}</div>
              <div className="flex-1">
                <div className="grid grid-cols-10 gap-3">
                  {rooms.map((room) => (
                    isCoordinator ? (
                      <RoomCardCoordinator
                        key={room.room_number}
                        room={room}
                        onClick={() => handleRoomClick(room)}
                      />
                    ) : (
                      <RoomCardStudent key={room.room_number} room={room} />
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && isCoordinator && (
        <RoomManagementModal
          room={selectedRoom}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};
