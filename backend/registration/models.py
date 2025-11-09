from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

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