from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout

from .models import Student
from .serializers import StudentRegistrationSerializer, StudentLoginSerializer, StudentSerializer
from .backends import StudentBackend

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        student = serializer.save()
        
        backend = StudentBackend()
        authenticated_student = backend.authenticate(
            request, 
            email=student.email, 
            password=request.data.get('password')
        )
        
        if authenticated_student:
            login(request, authenticated_student)
            return Response({
                'student': StudentSerializer(student).data,
                'message': 'Регистрация прошла успешно'
            }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = StudentLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        backend = StudentBackend()
        student = backend.authenticate(request, email=email, password=password)
        
        if student:
            login(request, student)
            return Response({
                'student': StudentSerializer(student).data,
                'message': 'Вход выполнен успешно'
            })
        else:
            return Response(
                {'error': 'Неверный email или пароль'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Выход выполнен успешно'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response(StudentSerializer(request.user).data)