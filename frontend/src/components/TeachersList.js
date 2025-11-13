import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeachersList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('/api/teachers/');
                setTeachers(response.data);
            } catch (error) {
                console.error('Ошибка загрузки преподавателей:', error);
                setError('Не удалось загрузить данные преподавателей');
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) return <div className="loading">Загрузка преподавателей...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="section teachers-section">
            <h2>Преподаватели</h2>
            <div className="teachers-list">
                {teachers.map(teacher => (
                    <div key={teacher.id} className="teacher-card">
                        <h3>{teacher.full_name}</h3>
                        <p className="subject">{teacher.subject}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeachersList;