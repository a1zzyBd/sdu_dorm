from rest_framework import serializers
from .models import Explanation, Room, RoomAssignment
from students.serializers import StudentSerializer


class ExplanationSerializer(serializers.ModelSerializer):
    """Serializer for Explanation model"""
    student_name = serializers.CharField(source='student.fullname', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    
    class Meta:
        model = Explanation
        fields = ['id', 'student_id', 'student_name', 'explanation_text', 'status', 'created_at', 'reviewed_at']
        read_only_fields = ['id', 'status', 'created_at', 'reviewed_at', 'student_id', 'student_name']


class ExplanationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating explanations"""
    class Meta:
        model = Explanation
        fields = ['explanation_text']


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for Room model"""
    current_occupancy = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ['room_number', 'block', 'floor', 'max_capacity', 'status', 'gender', 'current_occupancy', 'is_available']
    
    def get_current_occupancy(self, obj):
        """Get current occupancy count"""
        return obj.get_current_occupancy()
    
    def get_is_available(self, obj):
        """Check if room is available"""
        return obj.is_available()


class RoomAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for Room Assignment"""
    student = StudentSerializer(read_only=True)
    room_details = RoomSerializer(source='room', read_only=True)
    
    class Meta:
        model = RoomAssignment
        fields = ['id', 'student', 'room', 'room_details', 'assigned_at']
        read_only_fields = ['id', 'assigned_at']


class RoomAssignmentCreateSerializer(serializers.Serializer):
    """Serializer for creating room assignments"""
    student_id = serializers.CharField(required=True)
    room_number = serializers.CharField(required=True)
    
    def validate(self, data):
        """Validate room assignment"""
        from students.models import Student
        
        # Check if student exists
        try:
            student = Student.objects.get(student_id=data['student_id'])
        except Student.DoesNotExist:
            raise serializers.ValidationError({"student_id": "Student not found"})
        
        # Check if room exists
        try:
            room = Room.objects.get(room_number=data['room_number'])
        except Room.DoesNotExist:
            raise serializers.ValidationError({"room_number": "Room not found"})
        
        # Check if student gender matches room gender
        if student.gender != room.gender:
            raise serializers.ValidationError({
                "error": f"Gender mismatch: {student.gender} student cannot be assigned to {room.gender} room"
            })
        
        # Check if room is available
        if not room.is_available():
            raise serializers.ValidationError({"room_number": "Room is not available or at full capacity"})
        
        # Check if student is already assigned to a room
        if RoomAssignment.objects.filter(student=student).exists():
            raise serializers.ValidationError({"student_id": "Student is already assigned to a room"})
        
        data['student'] = student
        data['room'] = room
        return data


class RoomResidentSerializer(serializers.ModelSerializer):
    """Serializer for room residents"""
    student = StudentSerializer()
    
    class Meta:
        model = RoomAssignment
        fields = ['student', 'assigned_at']
