from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'group_number')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'group_number')