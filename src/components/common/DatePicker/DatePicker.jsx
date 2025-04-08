import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DatePicker.scss';

const DatePicker = ({ selectedDate, onChange, filterDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Названия дней недели (сокращенные)
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  // Генерация дней месяца
  const generateDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }
    
    return days;
  };

  // Переход к предыдущему месяцу
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Переход к следующему месяцу
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Проверка, является ли дата сегодняшней
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Проверка, является ли дата выходным
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="date-picker">
      <div className="date-picker__header">
        <button 
          onClick={prevMonth}
          className="date-picker__nav-button"
          aria-label="Предыдущий месяц"
        >
          &lt;
        </button>
        <h3 className="date-picker__month-title">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={nextMonth}
          className="date-picker__nav-button"
          aria-label="Следующий месяц"
        >
          &gt;
        </button>
      </div>

      <div className="date-picker__days-header">
        {dayNames.map(day => (
          <div key={day} className="date-picker__day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="date-picker__days-grid">
        {generateDays().map(date => {
          const isSelected = selectedDate && 
            date.toDateString() === selectedDate.toDateString();
          const isDisabled = filterDate ? !filterDate(date) : false;

          return (
            <button
              key={date.toString()}
              className={`date-picker__day 
                ${isSelected ? 'selected' : ''}
                ${isToday(date) ? 'today' : ''}
                ${isWeekend(date) ? 'weekend' : ''}
                ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onChange(date)}
              disabled={isDisabled}
              aria-label={`Выбрать ${date.getDate()} ${monthNames[date.getMonth()]}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  filterDate: PropTypes.func,
};

export default DatePicker;
