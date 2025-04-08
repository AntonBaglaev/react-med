import React from 'react';
import PropTypes from 'prop-types';
import './TimeSlotPicker.scss';

const TimeSlotPicker = ({ availableSlots, selectedTime, onSelect }) => {
  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="time-slot-picker">
        <div className="no-slots-message">
          Нет доступных слотов на выбранную дату
        </div>
      </div>
    );
  }

  return (
    <div className="time-slot-picker">
      <h3 className="time-slot-picker__title">Доступное время</h3>
      <div className="time-slot-picker__grid">
        {availableSlots.map(slot => (
          <button
            key={slot}
            className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
            onClick={() => onSelect(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

TimeSlotPicker.propTypes = {
  availableSlots: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTime: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default TimeSlotPicker;
