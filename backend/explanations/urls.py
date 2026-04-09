
from django.urls import path
from . import views

urlpatterns = [
    # Explanations - Student
    path('explanations/my/', views.my_explanations, name='my_explanations'),
    path('explanations/', views.create_explanation, name='create_explanation'),
    
    # Explanations - Coordinator
    path('explanations/pending/', views.pending_explanations, name='pending_explanations'),
    path('explanations/reviewed/', views.reviewed_explanations, name='reviewed_explanations'),
    path('explanations/<int:explanation_id>/approve/', views.approve_explanation, name='approve_explanation'),
    path('explanations/<int:explanation_id>/reject/', views.reject_explanation, name='reject_explanation'),
    
    # Rooms
    path('rooms/', views.list_rooms, name='list_rooms'),
    path('rooms/<str:room_number>/residents/', views.room_residents, name='room_residents'),
    
    # Room Assignments
    path('room-assignments/', views.assign_room, name='assign_room'),
    path('room-assignments/remove/', views.remove_from_room, name='remove_from_room'),
    
    # Reports
    path('reports/violations/export/', views.export_violations, name='export_violations'),
]
