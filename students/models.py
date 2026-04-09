from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Student(models.Model):
    """Student model representing dormitory residents"""
    student_id = models.CharField(max_length=20, primary_key=True)
    fullname = models.CharField(max_length=255)
    birthdate = models.DateField()
    specialty = models.CharField(max_length=100)
    course = models.CharField(max_length=10, help_text="Course (e.g., '2', '3' for students, '0' for coordinators)")
    
    # Email fields - University email is used for login
    university_email = models.EmailField(unique=True, help_text="University email (@stu.sdu.edu.kz)")
    personal_email = models.EmailField(null=True, blank=True, help_text="Personal email (e.g., @gmail.com)")
    email = models.EmailField(unique=True, help_text="Primary email (university_email)")  # For backward compatibility
    
    # School field
    school = models.CharField(max_length=255, null=True, blank=True, help_text="School name (e.g., №35 zhalpy mektep)")
    
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    access = models.CharField(
        max_length=20, 
        default='student',
        choices=[('student', 'Student'), ('coordinator', 'Coordinator')]
    )
    password_hash = models.CharField(max_length=255)
    violation_count = models.IntegerField(default=0)
    account_status = models.CharField(
        max_length=20,
        default='active',
        choices=[('active', 'Active'), ('blocked', 'Blocked')],
        help_text="Account status - blocked if 3+ violations"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Coordinator-specific fields
    status = models.CharField(max_length=255, null=True, blank=True, help_text="Status (e.g., Coordinator of B block)")
    degree = models.CharField(max_length=50, null=True, blank=True, help_text="Degree (e.g., M2, PhD)")
    special_room = models.CharField(max_length=20, null=True, blank=True, help_text="Special room for coordinator")
    
    # Personal Information (optional fields for profile)
    iin = models.CharField(max_length=12, null=True, blank=True, help_text="IIN number")
    iban = models.CharField(max_length=20, null=True, blank=True, help_text="IBAN number")
    doc_type = models.CharField(max_length=50, null=True, blank=True, help_text="Document type")
    doc_number = models.CharField(max_length=50, null=True, blank=True, help_text="Document number")
    doc_issue_date = models.DateField(null=True, blank=True, help_text="Document issue date")
    local_address = models.TextField(null=True, blank=True, help_text="Local Address")

    def set_password(self, raw_password):
        """Hash password using Argon2"""
        self.password_hash = make_password(raw_password, hasher='argon2')
    
    def check_password(self, raw_password):
        """Verify password against hash"""
        return check_password(raw_password, self.password_hash, preferred='argon2')
    
    def get_current_room(self):
        """Get current room via room_assignments"""
        from explanations.models import RoomAssignment
        assignment = RoomAssignment.objects.filter(student=self).first()
        return assignment.room.room_number if assignment else None

    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['student_id']

    def __str__(self):
        return f"{self.student_id} - {self.fullname}"
