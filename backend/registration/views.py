from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from .models import Student

@api_view(['POST'])
def register(request):
    try:
        data = request.data
        
        if data['password'] != data['password_confirm']:
            return Response({'error': 'Пароли не совпадают'}, status=400)
        
        if len(data['group_number']) != 4 or not data['group_number'].isdigit():
            return Response({'error': 'Номер группы должен быть из 4 цифр'}, status=400)
        
        user = Student.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            middle_name=data.get('middle_name', ''),
            group_number=data['group_number']
        )
        
        login(request, user)
        return Response({'message': 'Успешная регистрация'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Успешный вход'})
    else:
        return Response({'error': 'Неверный email или пароль'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Выход выполнен'})

@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        user_data = {
            'id': request.user.id,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'middle_name': request.user.middle_name,
            'group_number': request.user.group_number
        }
        return Response({'authenticated': True, 'user': user_data})
    return Response({'authenticated': False})

@api_view(['GET'])
def dashboard_data(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Не авторизован'}, status=401)
        
    return Response({
        'message': f'Добро пожаловать, {request.user.first_name}!',
        'user': {
            'full_name': f'{request.user.last_name} {request.user.first_name} {request.user.middle_name}',
            'group': request.user.group_number,
            'email': request.user.email
        },
        'grades': [
            {'subject': 'Математика', 'grade': 5},
            {'subject': 'Физика', 'grade': 4},
            {'subject': 'Программирование', 'grade': 5}
        ]
    })