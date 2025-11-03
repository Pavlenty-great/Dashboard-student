import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';

const academicYearConfig = {
  autumnSemester: {
    start: { month: 8, day: 1 },
    end: { month: 11, day: 31 },
    totalWeeks: 16
  },
  winterSemester: {
    start: { month: 0, day: 9 },
    end: { month: 4, day: 31 },
    totalWeeks: 16
  }
};

const Footer = () => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    const calculateStudyWeek = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      const dates = {
        autumn: {
          start: new Date(currentYear, academicYearConfig.autumnSemester.start.month, academicYearConfig.autumnSemester.start.day),
          end: new Date(currentYear, academicYearConfig.autumnSemester.end.month, academicYearConfig.autumnSemester.end.day),
          totalWeeks: academicYearConfig.autumnSemester.totalWeeks
        },
        winter: {
          start: new Date(currentYear, academicYearConfig.winterSemester.start.month, academicYearConfig.winterSemester.start.day),
          end: new Date(currentYear, academicYearConfig.winterSemester.end.month, academicYearConfig.winterSemester.end.day),
          totalWeeks: academicYearConfig.winterSemester.totalWeeks
        }
      };

      // Проверяем осенний семестр
      if (now >= dates.autumn.start && now <= dates.autumn.end) {
        const timeDiff = now.getTime() - dates.autumn.start.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(daysDiff / 7) + 1;
        
        setCurrentSemester('осенний');
        setCurrentWeek(Math.min(weekNumber, dates.autumn.totalWeeks));
        return;
      }
      
      // Проверяем зимний семестр
      if (now >= dates.winter.start && now <= dates.winter.end) {
        const timeDiff = now.getTime() - dates.winter.start.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(daysDiff / 7) + 1;
        
        setCurrentSemester('зимний');
        setCurrentWeek(Math.min(weekNumber, dates.winter.totalWeeks));
        return;
      }
      
      // Вне семестров
      setCurrentSemester(null);
      setCurrentWeek(null);
    };

    calculateStudyWeek();
    
    // Обновляем неделю каждый день
    const interval = setInterval(calculateStudyWeek, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Учебное заведение</p>
        
        {currentWeek && currentSemester && (
          <div className="study-info">
            <p className="study-week">
              {currentSemester.charAt(0).toUpperCase() + currentSemester.slice(1)} семестр
            </p>
            <p className="study-week">
              Неделя: {currentWeek} из 16
            </p>
          </div>
        )}
        
        {!currentWeek && (
          <p className="vacation-message">
            🎉 Сейчас каникулы!
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;