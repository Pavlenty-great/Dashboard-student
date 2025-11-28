from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Student

@admin.register(Student)
class StudentAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'group_number')
    list_filter = ('group_number', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'middle_name', 'group_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'group_number'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name', 'group_number')
    ordering = ('email',)