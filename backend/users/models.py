from django.db import models
import uuid
from django.contrib.auth.hashers import make_password, check_password
from .managers import StudentManager

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True)
    group_number = models.CharField(max_length=4)
    password = models.CharField(max_length=128)

    objects = StudentManager()

    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.group_number})"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def get_full_name(self):
        parts = [self.last_name, self.first_name]
        if self.middle_name:
            parts.append(self.middle_name)
        return " ".join(parts)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False