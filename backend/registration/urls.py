from django.urls import path
from . import views

urlpatterns = [
    path('api/exams/', views.exams_api, name='exams_api'),
    path('api/exams/<int:exam_id>/toggle/', views.toggle_exam, name='toggle_exam'),
    path('api/notes/', views.notes_api, name='notes_api'),
    path('api/notes/<int:note_id>/delete/', views.delete_note, name='delete_note'),
]