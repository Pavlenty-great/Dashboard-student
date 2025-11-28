from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from .models import Teacher
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Exam, StudentNote, Student
import json
from django.contrib.auth.models import User

@api_view(['POST'])
def register(request):
    try:
        data = request.data
        
        # Проверяем пароли
        if data['password'] != data['password_confirm']:
            return Response({'error': 'Пароли не совпадают'}, status=400)
        
        # Проверяем группу
        if len(data['group_number']) != 4 or not data['group_number'].isdigit():
            return Response({'error': 'Номер группы должен быть из 4 цифр'}, status=400)
        
        # Проверяем что email не занят
        if Student.objects.filter(email=data['email']).exists():
            return Response({'error': 'Пользователь с таким email уже существует'}, status=400)
        
        # Создаём пользователя через наш кастомный менеджер
        user = Student.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            middle_name=data.get('middle_name', ''),
            group_number=data['group_number']
        )
        
        # Автоматически логиним
        login(request, user)
        return Response({
            'message': 'Успешная регистрация',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'middle_name': user.middle_name,
                'group_number': user.group_number
            }
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'message': 'Успешный вход',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'middle_name': user.middle_name,
                'group_number': user.group_number
            }
        })
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

@api_view(['GET'])
def teachers_list(request):
    teachers = Teacher.objects.all()
    teachers_data = []
    
    for teacher in teachers:
        teachers_data.append({
            'id': teacher.id,
            'full_name': teacher.full_name(),
            'first_name': teacher.first_name,
            'last_name': teacher.last_name, 
            'middle_name': teacher.middle_name,
            'subject': teacher.subject
        })
    
    return Response(teachers_data)

def exams_api(request):
    exams = list(Exam.objects.all().values())
    return JsonResponse(exams, safe=False)

def toggle_exam(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        exam.passed = not exam.passed
        exam.save()
        return JsonResponse({'success': True, 'passed': exam.passed})
    except Exam.DoesNotExist:
        return JsonResponse({'success': False}, status=404)
    
# API для заметок
@csrf_exempt
def notes_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Не авторизован'}, status=401)

    try:
        student = Student.objects.get(id=request.user.id)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Студент не найден'}, status=404)

    if request.method == 'GET':
        scope = request.GET.get('scope', 'personal')

        if scope == 'group':
            #групповые заметки для этой же группы
            notes_qs = StudentNote.objects.filter(
                is_group_note=True,
                group_number=student.group_number
            ).order_by('-created_at')
        else:
            notes_qs = StudentNote.objects.filter(
                student=student,
                is_group_note=False
            ).order_by('-created_at')

        notes = [
            {
                'id': n.id,
                'text': n.text,
                'created_at': n.created_at.isoformat(),
                'date': n.created_at.strftime('%d.%m.%Y %H:%M'),
                'is_group_note': n.is_group_note,
                'author': {
                    'id': n.author.id,
                    'first_name': n.author.first_name,
                    'last_name': n.author.last_name,
                    'group_number': n.author.group_number,
                },
            }
            for n in notes_qs
        ]
        return JsonResponse(notes, safe=False)

    elif request.method == 'POST':
        try:
            print("=== ПОЛУЧЕН ЗАПРОС НА ДОБАВЛЕНИЕ ЗАМЕТКИ ===")
            
            # Проверяем тело запроса
            body = request.body.decode('utf-8')
            print("Тело запроса:", body)
            
            data = json.loads(body)
            text = data.get('text', '').strip()
            is_group_note = bool(data.get('is_group_note', False))
            
            print("Текст заметки:", text)
            
            if not text:
                return JsonResponse({'success': False, 'error': 'Текст заметки не может быть пустым'}, status=400)
            
            
            
            # Создаем заметку с привязкой к студенту
            note = StudentNote.objects.create(
                student=student,
                author=student,
                text=text,
                is_group_note=is_group_note
            )
            print("Заметка создана в БД с ID:", note.id)
            
            return JsonResponse({
                'success': True, 
                'note': {
                    'id': note.id,
                    'text': note.text,
                    'created_at': note.created_at.isoformat(),
                    'date': note.created_at.strftime('%d.%m.%Y %H:%M'),
                    'is_group_note': note.is_group_note,
                    'author': {
                        'id': note.author.id,
                        'first_name': note.author.first_name,
                        'last_name': note.author.last_name,
                        'group_number': note.author.group_number,
                    },
                }
            })
            
        except json.JSONDecodeError as e:
            print("Ошибка JSON:", e)
            return JsonResponse({'success': False, 'error': 'Неверный JSON формат'}, status=400)
        except Exception as e:
            print("Общая ошибка:", e)
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def delete_note(request, note_id):
    if request.method == 'DELETE':
        try:
            # Используем первого студента
            student = Student.objects.first()
            if not student:
                return JsonResponse({'success': False, 'error': 'Студент не найден'}, status=404)
            
            note = StudentNote.objects.get(id=note_id, student=student)
            note.delete()
            return JsonResponse({'success': True})
        except StudentNote.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Заметка не найдена'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)