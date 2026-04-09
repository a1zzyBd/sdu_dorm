from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', views.login, name='login'),

    # Profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/change-password/', views.change_password, name='change_password'),

    # Students
    path('students/unassigned/', views.get_unassigned_students, name='unassigned_students'),
]
