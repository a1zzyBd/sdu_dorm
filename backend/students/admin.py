from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'fullname', 'email', 'gender', 'course', 'access', 'violation_count', 'get_current_room']
    list_filter = ['gender', 'access', 'course', 'specialty']
    search_fields = ['student_id', 'fullname', 'email']
    readonly_fields = ['created_at', 'violation_count']

    fieldsets = (
        ('Basic Information', {
            'fields': ('student_id', 'fullname', 'birthdate', 'gender', 'email')
        }),
        ('Academic Information', {
            'fields': ('specialty', 'course')
        }),
        ('Account Information', {
            'fields': ('access', 'password_hash', 'violation_count', 'created_at')
        }),
        ('Personal Information', {
            'fields': ('iin', 'iban', 'doc_type', 'doc_number', 'doc_issue_date', 'local_address'),
            'classes': ('collapse',)
        }),
    )
