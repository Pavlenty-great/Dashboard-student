from rest_framework import serializers
from .models import Student

class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = [
            'email', 'username', 'first_name', 'last_name', 'middle_name', 
            'group_number', 'password', 'password_confirm'
        ]

    def validate_email(self, value):
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate_username(self, value):
        if Student.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value

    def validate_group_number(self, value):
        if not value.isdigit() or len(value) != 4:
            raise serializers.ValidationError("Номер группы должен состоять из 4 цифр")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        student = Student.objects.create_user(
            **validated_data,
            password=password
        )
        return student

class StudentLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'middle_name',
            'group_number'
        ]