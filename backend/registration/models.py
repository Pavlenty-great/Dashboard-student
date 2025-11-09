from django.db import models
from django.contrib.auth.models import AbstractUser

class Student(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30) 
    middle_name = models.CharField(max_length=30, blank=True)
    group_number = models.CharField(max_length=4)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'group_number']

    def __str__(self):
        return f"{self.last_name} {self.first_name}"