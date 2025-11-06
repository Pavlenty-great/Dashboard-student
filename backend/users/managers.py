from django.db import models

class StudentManager(models.Manager):
    def create_user(self, email, username, first_name, last_name, group_number, 
                   password=None, middle_name=''):
        if not email:
            raise ValueError('Email обязателен')
        if not username:
            raise ValueError('Имя пользователя обязательно')
        if not first_name:
            raise ValueError('Имя обязательно')
        if not last_name:
            raise ValueError('Фамилия обязательна')
        if not group_number:
            raise ValueError('Номер группы обязателен')

        email = self.normalize_email(email)
        
        student = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name,
            group_number=group_number,
        )
        
        student.set_password(password)
        student.save(using=self._db)
        return student

    def normalize_email(self, email):
        email = email or ''
        return email.lower()