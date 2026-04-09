
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Student
from .serializers import StudentSerializer, ProfileUpdateSerializer, ChangePasswordSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login endpoint - Only accepts university email (@stu.sdu.edu.kz or @sdu.edu.kz)"""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'success': False,
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if email is university email
    if not (email.endswith('@stu.sdu.edu.kz') or email.endswith('@sdu.edu.kz')):
        return Response({
            'success': False,
            'error': 'Please use your university email (@stu.sdu.edu.kz or @sdu.edu.kz)'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Try to find student by university_email first, then fallback to email
        try:
            student = Student.objects.get(university_email=email)
        except Student.DoesNotExist:
            student = Student.objects.get(email=email)

        if not student.check_password(password):
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Get or create Django User for JWT authentication
        user, created = User.objects.get_or_create(
            username=student.email,
            defaults={'email': student.email}
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['student_id'] = student.student_id
        refresh['email'] = student.email
        refresh['access'] = student.access

        return Response({
            'success': True,
            'user': {
                'student_id': student.student_id,
                'fullname': student.fullname,
                'email': student.email,
                'birthdate': str(student.birthdate),
                'gender': student.gender,
                'specialty': student.specialty,
                'course': student.course,
                'room': student.get_current_room(),
                'access': student.access,
                'violation_count': student.violation_count,
                'account_status': student.account_status
            },
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })

    except Student.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get or update current user profile"""
    student_id = request.auth.payload.get('student_id')

    try:
        student = Student.objects.get(student_id=student_id)
        
        if request.method == 'GET':
            serializer = StudentSerializer(student)
            return Response({
                'success': True,
                'data': serializer.data
            })
        
        elif request.method == 'PUT':
            serializer = ProfileUpdateSerializer(student, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'data': StudentSerializer(student).data
                })
            
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Student.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)


# Keep old endpoint for backward compatibility (deprecated)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update profile information (DEPRECATED - use PUT /profile/ instead)"""
    student_id = request.auth.payload.get('student_id')

    try:
        student = Student.objects.get(student_id=student_id)
        serializer = ProfileUpdateSerializer(student, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'data': StudentSerializer(student).data
            })

        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Student.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change password"""
    student_id = request.auth.payload.get('student_id')

    try:
        student = Student.objects.get(student_id=student_id)
        serializer = ChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not student.check_password(old_password):
            return Response({
                'success': False,
                'error': 'Incorrect old password'
            }, status=status.HTTP_400_BAD_REQUEST)

        student.set_password(new_password)
        student.save()

        return Response({
            'success': True,
            'message': 'Password changed successfully'
        })

    except Student.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Student not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unassigned_students(request):
    """Get unassigned students filtered by gender"""
    # Check if user is coordinator
    access = request.auth.payload.get('access')
    if access != 'coordinator':
        return Response({
            'success': False,
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    gender = request.query_params.get('gender')

    from explanations.models import RoomAssignment

    # Get students without room assignments
    assigned_student_ids = RoomAssignment.objects.values_list('student_id', flat=True)
    students = Student.objects.exclude(student_id__in=assigned_student_ids)

    if gender:
        students = students.filter(gender=gender)

    serializer = StudentSerializer(students, many=True)

    return Response({
        'success': True,
        'data': serializer.data
    })
