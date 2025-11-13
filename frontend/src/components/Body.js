import React, { useState, useEffect } from 'react';
import '../styles/Body.css';
import TeachersList from './TeachersList.js';

const Body = () => {
  // Состояние для экзаменов и зачетов из БД
  const [exams, setExams] = useState([]);

  // Состояние для заметок
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Загрузка экзаменов из БД
  useEffect(() => {
    fetchExams();
  }, []);

  // Загрузка заметок из localStorage при монтировании
  useEffect(() => {
    const savedNotes = localStorage.getItem('studentNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохранение заметок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('studentNotes', JSON.stringify(notes));
  }, [notes]);

  // Загрузка экзаменов из БД
  const fetchExams = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/exams/');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Ошибка загрузки экзаменов:', error);
    }
  };

  // Обработчик изменения статуса экзамена/зачета
  const handleExamToggle = async (examId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/exams/${examId}/toggle/`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        // Обновляем локальное состояние
        setExams(exams.map(exam => 
          exam.id === examId ? { ...exam, passed: result.passed } : exam
        ));
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  // Обработчик добавления новой заметки
  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        date: new Date().toLocaleString('ru-RU')
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  // Обработчик удаления заметки
  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // Обработчик нажатия Enter для добавления заметки
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Форматирование времени
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  return (
    <div className="body">
      {/* Верхний ряд: преподаватели и экзамены рядом */}
      <div className="top-row">
        {/* Секция преподавателей */}
        <TeachersList />

        {/* Секция экзаменов и зачетов из БД */}
        <div className="section exams-section">
          <h2>Экзамены и зачеты</h2>
          <div className="exams-list">
            {exams.map(exam => (
              <div key={exam.id} className="exam-item">
                <div className="exam-info">
                  <span className="exam-name">{exam.name}</span>
                  <span className={`exam-type ${exam.type}`}>
                    {exam.type === 'экзамен' ? 'Экзамен' : 'Зачет'}
                  </span>
                  {(exam.date || exam.classroom || exam.teacher) && (
                    <div className="exam-details">
                      {exam.date && (
                        <span className="exam-date">
                          {formatDate(exam.date)}
                          {exam.time && ` в ${formatTime(exam.time)}`}
                        </span>
                      )}
                      {exam.classroom && (
                        <span className="exam-classroom">Ауд: {exam.classroom}</span>
                      )}
                      {exam.teacher && (
                        <span className="exam-teacher">{exam.teacher}</span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className={`exam-toggle ${exam.passed ? 'passed' : 'not-passed'}`}
                  onClick={() => handleExamToggle(exam.id)}
                >
                  {exam.passed ? '✓' : '✗'}
                </button>
              </div>
            ))}
            {exams.length === 0 && (
              <p className="no-data">Нет данных об экзаменах</p>
            )}
          </div>
        </div>
      </div>

      {/* Нижний ряд: заметки на всю ширину */}
      <div className="section notes-section">
        <h2>Заметки</h2>
        <div className="notes-input">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите новую заметку..."
            className="note-input"
          />
          <button onClick={handleAddNote} className="add-note-btn">
            Добавить
          </button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-content">
                <p>{note.text}</p>
                <span className="note-date">{note.date}</span>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="delete-note-btn"
              >
                ×
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="no-notes">Заметок пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;