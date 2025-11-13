import React, { useState, useEffect } from 'react';
import '../styles/Body.css';
import TeachersList from './TeachersList.js';

const Body = () => {
  // Состояние для экзаменов и зачетов
  const [exams, setExams] = useState([
    { id: 1, name: 'Математика', type: 'экзамен', passed: false },
    { id: 2, name: 'Физика', type: 'зачет', passed: false },
    { id: 3, name: 'Программирование', type: 'экзамен', passed: false },
    { id: 4, name: 'Английский язык', type: 'зачет', passed: false },
    { id: 5, name: 'История', type: 'экзамен', passed: false },
    { id: 6, name: 'Философия', type: 'зачет', passed: false },
  ]);

  // Состояние для заметок
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

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

  // Обработчик изменения статуса экзамена/зачета
  const handleExamToggle = (examId) => {
    setExams(exams.map(exam => 
      exam.id === examId ? { ...exam, passed: !exam.passed } : exam
    ));
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

  return (
    <div className="body">
      {/* Верхний ряд: преподаватели и экзамены рядом */}
      <div className="top-row">
        {/* Секция преподавателей */}
        <TeachersList />  {/* ← Замените статичный список на компонент */}

        {/* Секция экзаменов и зачетов */}
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
                </div>
                <button
                  className={`exam-toggle ${exam.passed ? 'passed' : 'not-passed'}`}
                  onClick={() => handleExamToggle(exam.id)}
                >
                  {exam.passed ? '✓' : '✗'}
                </button>
              </div>
            ))}
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