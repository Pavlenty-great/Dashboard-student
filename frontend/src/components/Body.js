import React, { useState } from 'react';
import '../styles/Body.css';

function Body(){
    return(
        <div>
            <TeachersList />
            <ExamsList />
            <Notes />
        </div>
    );
}

function TeachersList(){
    const teachers = [
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Анна Смирнова' },
    { id: 3, name: 'Сергей Петров' },
    ];

    return(
        <div className='teachers-list'>
            <h3>Список преподавателей</h3>
            <ul>
                {teachers.map(teacher => (
                    <li key={teacher.id}>{teacher.name}</li>
                ))}
            </ul>
        </div>
    );
}

function ExamsList(){
    const exams = [
    { id: 1, name: 'Математика', type: 'Экзамен' },
    { id: 2, name: 'Физика', type: 'Зачёт' },
    { id: 3, name: 'Информатика', type: 'Экзамен' },
  ];

    return (
        <div className='exams-list'>
            <h3>Экзамены и зачеты</h3>
        <ul>
            {exams.map(exam => (
                <li key={exam.id}>{exam.name} - {exam.type}</li>
            ))}
        </ul>
        </div>
    );
}

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, newNote]);
      setNewNote('');
    }
  };

  return (
    <div>
      <h3>Заметки</h3>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Введите заметку"
      />
      <button onClick={handleAddNote}>Добавить</button>
      <ul className='notes'>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

export default Body;