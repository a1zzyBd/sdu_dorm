import os
import subprocess
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
from django.conf import settings

class Command(BaseCommand):
    help = 'Applies migrations, loads seed data, and verifies the database.'

    def handle(self, *args, **options):
        self.stdout.write("===================================")
        self.stdout.write("SDU Dorm: Database Update Script")
        self.stdout.write("===================================")

        # 1. Apply migrations
        self.stdout.write("\nApplying migrations...")
        call_command('makemigrations')
        call_command('migrate')

        # 2. Load seed data
        self.stdout.write("\nLoading seed data...")
        self.stdout.write(self.style.WARNING("WARNING: This will delete ALL existing data!"))
        
        confirm = input("Continue? (y/n) ")
        if confirm.lower() != 'y':
            self.stdout.write(self.style.ERROR("Cancelled."))
            return

        # Исполняем SQL файл. Этот способ надежнее, чем dbshell
        # Он работает с PostgreSQL, MySQL и SQLite.
        sql_file_path = os.path.join(settings.BASE_DIR, 'seed_data.sql')
        if not os.path.exists(sql_file_path):
            self.stdout.write(self.style.ERROR(f"Seed file not found at: {sql_file_path}"))
            return
        
        self.stdout.write("Executing seed_data.sql...")
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            with connection.cursor() as cursor:
                # Выполняем весь скрипт одним запросом
                cursor.execute(sql_script)
        
        self.stdout.write(self.style.SUCCESS("Seed data loaded successfully!"))

        # 3. Verify data
        self.stdout.write("\nVerifying data...")
        from students.models import Student
        
        self.stdout.write(f"Total students: {Student.objects.count()}")
        self.stdout.write(f"Students with school: {Student.objects.filter(school__isnull=False).count()}")
        self.stdout.write(f"Students with personal_email: {Student.objects.filter(personal_email__isnull=False).count()}")
        self.stdout.write(f"Students with university_email: {Student.objects.filter(university_email__isnull=False).count()}")
        self.stdout.write(f"Coordinators: {Student.objects.filter(access='coordinator').count()}")

        coordinator = Student.objects.filter(access='coordinator').first()
        if coordinator:
            self.stdout.write(f"\nCoordinator: {coordinator.fullname}")
            self.stdout.write(f"  Status: {coordinator.status}")
            self.stdout.write(f"  Degree: {coordinator.degree}")
            self.stdout.write(f"  Special Room: {coordinator.special_room}")

        # 4. Final message
        self.stdout.write("\n===================================")
        self.stdout.write(self.style.SUCCESS("Database update complete!"))
        self.stdout.write("===================================\n")
        self.stdout.write("Test credentials:")
        self.stdout.write("Student: nurzhan.aitanov@stu.sdu.edu.kz / password123")
        self.stdout.write("Coordinator: coordinator@sdu.edu.kz / password123\n")
        self.stdout.write("Remember Me feature:")
        self.stdout.write("  ✓ Checked   → localStorage (stays logged in)")
        self.stdout.write("  ✗ Unchecked → sessionStorage (logout on browser close)\n")
        self.stdout.write("\nAccount Blocking:")
        self.stdout.write("  3+ violations → account_status = 'blocked'")
        self.stdout.write("  Blocked students cannot access any modules")