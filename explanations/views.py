
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.http import HttpResponse
from datetime import datetime
import csv

from .models import Explanation, Room, RoomAssignment
from students.models import Student
from .serializers import (
    ExplanationSerializer, ExplanationCreateSerializer,
    RoomSerializer, RoomAssignmentSerializer, RoomAssignmentCreateSerializer,
    RoomResidentSerializer
)


# ========== Explanation Views ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_explanations(request):
    """Get current user's explanations"""
    student_id = request.auth.payload.get('student_id')
    explanations = Explanation.objects.filter(student_id=student_id)
    serializer = ExplanationSerializer(explanations, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_explanation(request):
    """Create new explanation"""
    student_id = request.auth.payload.get('student_id')
    
    try:
        student = Student.objects.get(student_id=student_id)
        
        # Check if student already has a pending explanation
        if Explanation.objects.filter(student=student, status='pending').exists():
            return Response({
                'success': False,
                'error': 'You already have a pending explanation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ExplanationCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            explanation = serializer.save(student=student)
            return Response({
                'success': True,
                'message': 'Explanation submitted successfully',
                'data': ExplanationSerializer(explanation).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Student.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_explanations(request):
    """Get pending explanations (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    explanations = Explanation.objects.filter(status='pending')
    serializer = ExplanationSerializer(explanations, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reviewed_explanations(request):
    """Get reviewed explanations (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    explanations = Explanation.objects.filter(status__in=['approved', 'rejected'])
    serializer = ExplanationSerializer(explanations, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def approve_explanation(request, explanation_id):
    """Approve explanation (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        explanation = Explanation.objects.get(id=explanation_id)
        
        if explanation.status != 'pending':
            return Response({
                'success': False,
                'error': 'Explanation has already been reviewed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Approve explanation and increment violation count
        explanation.status = 'approved'
        explanation.reviewed_at = timezone.now()
        explanation.save()
        
        student = explanation.student
        student.violation_count += 1
        
        # Block account if 3 or more violations
        if student.violation_count >= 3:
            student.account_status = 'blocked'
        
        student.save()
        
        return Response({
            'success': True,
            'message': 'Explanation approved',
            'data': ExplanationSerializer(explanation).data
        })
    
    except Explanation.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Explanation not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def reject_explanation(request, explanation_id):
    """Reject explanation (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        explanation = Explanation.objects.get(id=explanation_id)
        
        if explanation.status != 'pending':
            return Response({
                'success': False,
                'error': 'Explanation has already been reviewed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Reject explanation
        explanation.status = 'rejected'
        explanation.reviewed_at = timezone.now()
        explanation.save()
        
        return Response({
            'success': True,
            'message': 'Explanation rejected',
            'data': ExplanationSerializer(explanation).data
        })
    
    except Explanation.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Explanation not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ========== Room Views ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_rooms(request):
    """List rooms with optional block filter"""
    block = request.query_params.get('block')
    
    rooms = Room.objects.filter(status='active')
    
    if block:
        rooms = rooms.filter(block=block.upper())
    
    serializer = RoomSerializer(rooms, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_residents(request, room_number):
    """Get residents of a specific room"""
    try:
        room = Room.objects.get(room_number=room_number)
        assignments = RoomAssignment.objects.filter(room=room)
        serializer = RoomResidentSerializer(assignments, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    except Room.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Room not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_room(request):
    """Assign student to room (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = RoomAssignmentCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        student = serializer.validated_data['student']
        room = serializer.validated_data['room']
        
        assignment = RoomAssignment.objects.create(student=student, room=room)
        
        return Response({
            'success': True,
            'message': f'Student {student.student_id} assigned to room {room.room_number}',
            'data': RoomAssignmentSerializer(assignment).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_room(request):
    """Remove student from room (Coordinator only)"""
    access = request.auth.payload.get('access')
    
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    student_id = request.data.get('student_id')
    room_number = request.data.get('room_number')
    
    if not student_id or not room_number:
        return Response({
            'success': False,
            'error': 'student_id and room_number are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        assignment = RoomAssignment.objects.get(student_id=student_id, room__room_number=room_number)
        assignment.delete()
        
        return Response({
            'success': True,
            'message': f'Student {student_id} removed from room {room_number}'
        })
    
    except RoomAssignment.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Room assignment not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ========== Export Views ==========

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_violations(request):
    """Export violations report as CSV (Coordinator only)"""
    # Check if user is coordinator
    access = request.auth.payload.get('access')
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied. Only coordinators can export reports.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    block = request.data.get('block', 'all')
    date_from = request.data.get('date_from')
    date_to = request.data.get('date_to')
    
    if not date_from or not date_to:
        return Response({
            'success': False,
            'error': 'date_from and date_to are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse dates
        date_from = datetime.strptime(date_from, '%Y-%m-%d')
        date_to = datetime.strptime(date_to, '%Y-%m-%d')
        
        # Query explanations
        explanations = Explanation.objects.filter(
            status='approved',
            created_at__date__gte=date_from,
            created_at__date__lte=date_to
        ).select_related('student')
        
        # Filter by block if needed
        if block != 'all':
            # Get students in the specified block
            room_assignments = RoomAssignment.objects.filter(room__block=block.upper())
            student_ids = room_assignments.values_list('student_id', flat=True)
            explanations = explanations.filter(student_id__in=student_ids)
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        filename = f'{block}_block_violations_from_{date_from.strftime("%Y-%m-%d")}_to_{date_to.strftime("%Y-%m-%d")}.csv'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        writer = csv.writer(response)
        writer.writerow(['First Name', 'Last Name', 'Date', 'Violation', 'Violation Count', 'Status'])
        
        for exp in explanations:
            names = exp.student.fullname.split(' ', 1)
            first_name = names[0] if len(names) > 0 else ''
            last_name = names[1] if len(names) > 1 else ''
            
            # Get student status from coordinator fields or default
            student_status = exp.student.status if exp.student.status else 'Student'
            
            writer.writerow([
                first_name,
                last_name,
                exp.created_at.strftime('%Y-%m-%d'),
                exp.explanation_text[:50],  # First 50 chars
                exp.student.violation_count,
                student_status
            ])
        
        return response
    
    except ValueError as e:
        return Response({
            'success': False,
            'error': 'Invalid date format. Use YYYY-MM-DD'
        }, status=status.HTTP_400_BAD_REQUEST)
