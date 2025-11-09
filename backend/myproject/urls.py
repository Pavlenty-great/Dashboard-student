from django.contrib import admin
from django.urls import path
from registration import views  # ← Должен быть такой импорт

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.register),
    path('api/login/', views.login_view),
    path('api/logout/', views.logout_view),
    path('api/check-auth/', views.check_auth),
    path('api/dashboard/', views.dashboard_data),
]