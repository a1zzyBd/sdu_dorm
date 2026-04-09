from django.contrib import admin
from .models import Explanation, Room, RoomAssignment


@admin.register(Explanation)
class ExplanationAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'status', 'created_at', 'reviewed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['student__student_id', 'student__fullname', 'explanation_text']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Explanation Details', {
            'fields': ('student', 'explanation_text', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'reviewed_at')
        }),
    )


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'block', 'floor', 'gender', 'get_current_occupancy', 'max_capacity', 'status']
    list_filter = ['block', 'floor', 'gender', 'status']
    search_fields = ['room_number']
    
    def get_current_occupancy(self, obj):
        return obj.get_current_occupancy()
    get_current_occupancy.short_description = 'Current Occupancy'


@admin.register(RoomAssignment)
class RoomAssignmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'room', 'assigned_at']
    list_filter = ['room__block', 'assigned_at']
    search_fields = ['student__student_id', 'student__fullname', 'room__room_number']
    readonly_fields = ['assigned_at']
