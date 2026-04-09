from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model"""
    room = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'student_id', 'fullname', 'birthdate', 'specialty', 'course',
            'email', 'university_email', 'personal_email', 'school',
            'gender', 'access', 'violation_count', 'room',
            'iin', 'iban', 'doc_type', 'doc_number', 'doc_issue_date', 'local_address',
            'status', 'degree', 'special_room'
        ]
        read_only_fields = ['student_id', 'violation_count', 'room']
    
    def get_room(self, obj):
        """Get current room number"""
        return obj.get_current_room()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating profile information"""
    class Meta:
        model = Student
        fields = ['iin', 'iban', 'doc_type', 'doc_number', 'doc_issue_date', 'local_address']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    
    def validate_new_password(self, value):
        """Validate new password strength"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return value
