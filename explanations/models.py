from django.db import models
from django.db.models import Q


class Explanation(models.Model):
    """Explanation model for violation submissions"""
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='explanations')
    explanation_text = models.TextField()
    status = models.CharField(
        max_length=20, 
        default='pending',
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected')
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'explanations'
        verbose_name = 'Explanation'
        verbose_name_plural = 'Explanations'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['student'], 
                condition=Q(status='pending'),
                name='one_pending_per_student'
            )
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.status} ({self.created_at.strftime('%Y-%m-%d')})"


class Room(models.Model):
    """Room model for dormitory rooms"""
    room_number = models.CharField(max_length=10, primary_key=True)
    block = models.CharField(max_length=1, choices=[('A', 'Block A'), ('B', 'Block B')])
    floor = models.IntegerField()
    max_capacity = models.IntegerField(default=4)
    status = models.CharField(
        max_length=20, 
        default='active',
        choices=[('active', 'Active'), ('maintenance', 'Maintenance')]
    )
    gender = models.CharField(
        max_length=10, 
        choices=[('male', 'Male'), ('female', 'Female')],
        help_text="Block A = male, Block B = female"
    )
    
    def get_current_occupancy(self):
        """Get current number of students in the room"""
        return RoomAssignment.objects.filter(room=self).count()
    
    def is_available(self):
        """Check if room has space available"""
        return self.status == 'active' and self.get_current_occupancy() < self.max_capacity
    
    class Meta:
        db_table = 'rooms'
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'
        ordering = ['block', 'room_number']

    def __str__(self):
        return f"Room {self.room_number} (Block {self.block})"


class RoomAssignment(models.Model):
    """Room assignment model linking students to rooms"""
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='room_assignments')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_assignments'
        verbose_name = 'Room Assignment'
        verbose_name_plural = 'Room Assignments'
        ordering = ['-assigned_at']
        # One student can only be in one active room
        constraints = [
            models.UniqueConstraint(
                fields=['student'],
                name='one_active_room_per_student'
            )
        ]

    def __str__(self):
        return f"{self.student.student_id} → {self.room.room_number}"
