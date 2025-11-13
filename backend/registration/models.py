from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.conf import settings

class StudentManager(BaseUserManager):
    """Кастомный менеджер для модели Student без username"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Создает и возвращает пользователя с email и паролем"""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Создает и возвращает суперпользователя"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class Student(AbstractUser):
    # Убираем username полностью
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    # Новые поля
    first_name = models.CharField(_('first name'), max_length=30)
    last_name = models.CharField(_('last name'), max_length=30) 
    middle_name = models.CharField(_('middle name'), max_length=30, blank=True)
    group_number = models.CharField(_('group number'), max_length=4)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'group_number']
    
    # Используем кастомный менеджер
    objects = StudentManager()

    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.email})"

    class Meta:
        db_table = 'students'
        verbose_name = _('student')
        verbose_name_plural = _('students')

class Teacher(models.Model):
    first_name = models.CharField(max_length=100, verbose_name='Имя')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    middle_name = models.CharField(max_length=100, blank=True, verbose_name='Отчество')
    subject = models.CharField(max_length=200, verbose_name='Предмет')
    
    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.middle_name} - {self.subject}"
    
    def full_name(self):
        return f"{self.last_name} {self.first_name} {self.middle_name}"
    
    class Meta:
        db_table = 'teachers'
        
        managed = False

class Subject(models.Model):
    SUBJECT_TYPES = [
        ('exam', 'Экзамен'),
        ('test', 'Зачёт'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Название предмета')
    subject_type = models.CharField(max_length=10, choices=SUBJECT_TYPES, verbose_name='Тип')
    date = models.DateField(verbose_name='Дата')
    time = models.TimeField(verbose_name='Время', blank=True, null=True)
    classroom = models.CharField(max_length=50, verbose_name='Аудитория', blank=True)
    teacher = models.CharField(max_length=100, verbose_name='Преподаватель', blank=True)
    notes = models.TextField(verbose_name='Примечания', blank=True)
    
    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.name} ({self.get_subject_type_display()})"
    
from django.db import models

from django.db import models

class Exam(models.Model):
    TYPE_CHOICES = [
        ('экзамен', 'Экзамен'),
        ('зачет', 'Зачёт'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Название предмета')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='Тип')
    date = models.DateField(verbose_name='Дата', null=True, blank=True)
    time = models.TimeField(verbose_name='Время', null=True, blank=True)
    classroom = models.CharField(max_length=50, verbose_name='Аудитория', blank=True)
    teacher = models.CharField(max_length=100, verbose_name='Преподаватель', blank=True)
    passed = models.BooleanField(default=False, verbose_name='Сдан')

    class Meta:
        verbose_name = 'Экзамен/зачёт'
        verbose_name_plural = 'Экзамены и зачёты'
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.name} ({self.type})"
    
class StudentNote(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Студент')
    text = models.TextField(verbose_name='Текст заметки')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Заметка студента'
        verbose_name_plural = 'Заметки студентов'
        ordering = ['-created_at']

    def __str__(self):
        return f"Заметка {self.student.username} ({self.created_at.date()})"