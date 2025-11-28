import React, { useState, useEffect } from 'react';
import '../styles/Body.css';
import TeachersList from './TeachersList.js';

const Body = () => {
  // Состояние для экзаменов и зачетов из БД
  const [exams, setExams] = useState([]);

  // Состояние для заметок
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  //режим заметок
  const [notesScope, setNotesScope] = useState('personal');

  //флаг для создаваемой заметки
  const [isGroupNote, setIsGroupNote] = useState(false);

  // Первый useEffect: загрузка экзаменов и начальных заметок
  useEffect(() => {
    fetchExams();
    fetchNotes('personal');
  }, []);

  // Второй useEffect: смена вкладки заметок
  useEffect(() => {
    fetchNotes(notesScope);
  }, [notesScope]);

  const fetchNotes = async (scope) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notes/?
scope=${scope}`, {
        credentials: 'include',
      });
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
      setNotes([]);
    }
  };
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

  // Обработчик добавления новой заметки в БД
  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch('http://localhost:8000/api/notes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ text: newNote.trim(), is_group_note: isGroupNote, })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error('Ошибка добавления заметки:', result.error);
          return;
        }

        setNotes([result.note, ...notes]);
        setNewNote('');

      } catch (error) {
        console.error('Ошибка добавления заметки:', error);
      }
    }
  };

  // Обработчик удаления заметки из БД
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notes/${noteId}/delete/`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        console.error('Ошибка удаления заметки:', result.error);
      }
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
    }
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

  // Форматирование даты заметки
  const formatNoteDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

        {/* Переключатель режима заметок: личные / группы */}
        <div className="notes-scope-toggle">
          <button
            className={notesScope === 'personal' ? 'scope-btn active' : 'scope-btn'}
            onClick={() => setNotesScope('personal')}
          >
            Мои заметки
          </button>
          <button
            className={notesScope === 'group' ? 'scope-btn active' : 'scope-btn'}
            onClick={() => setNotesScope('group')}
          >
            Заметки группы
          </button>
        </div>

        <div className="notes-input">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите новую заметку..."
            className="note-input"
          />

          {/* Чекбокс: сделать заметку групповой */}
          <label className="group-note-checkbox">
            <input
              type="checkbox"
              checked={isGroupNote}
              onChange={(e) => setIsGroupNote(e.target.checked)}
            />
            Сделать заметку групповой
          </label>

          <button onClick={handleAddNote} className="add-note-btn">
            Добавить
          </button>
        </div>

        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-content">
                <p>{note.text}</p>
                <span className="note-date">
                  {note.date || formatNoteDate(note.created_at)}
                </span>

                {/* Подпись автора у групповых заметок */}
                {note.is_group_note && note.author && (
                  <span className="note-author">
                    Автор: {note.author.last_name} {note.author.first_name} ({note.author.group_number})
                  </span>
                )}
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
            <p className="no-notes">
              {notesScope === 'personal'
                ? 'Личных заметок пока нет'
                : 'Групповых заметок пока нет'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;