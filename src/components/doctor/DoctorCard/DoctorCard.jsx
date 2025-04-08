import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faCalendarAlt, faClock, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import "./DoctorCard.scss";

const DoctorCard = ({ doctor, onBookAppointment }) => {
	// Форматирование графика работы
	const formatSchedule = (schedule) => {
		const daysMap = {
			monday: "Пн",
			tuesday: "Вт",
			wednesday: "Ср",
			thursday: "Чт",
			friday: "Пт",
			saturday: "Сб",
			sunday: "Вс",
		};

		return Object.entries(schedule)
			.filter(([_, isWorking]) => isWorking)
			.map(([day]) => daysMap[day])
			.join(", ");
	};

	// Расчет рейтинга (можно заменить реальными данными)
	const renderRating = () => {
		const rating = doctor.rating || (Math.random() * 2 + 3).toFixed(1);
		return (
			<div className="doctor-card__rating">
				<span className="doctor-card__rating-value">{rating}</span>
				<div className="doctor-card__rating-stars">
					{"★".repeat(Math.floor(rating))}
					{"☆".repeat(5 - Math.floor(rating))}
				</div>
			</div>
		);
	};

	return (
		<div className="doctor-card">
			<div className="doctor-card__header">
				<div className="doctor-card__avatar">
					{doctor.photo ? (
						<img
							src={doctor.photo}
							alt={`${doctor.firstName} ${doctor.lastName}`}
							className="doctor-card__avatar-img"
						/>
					) : (
						<div className="doctor-card__avatar-icon">
							<FontAwesomeIcon icon={faUserMd} />
						</div>
					)}
				</div>

				<div className="doctor-card__info">
					<h3 className="doctor-card__name">
						{doctor.lastName} {doctor.firstName} {doctor.middleName}
					</h3>
					<p className="doctor-card__specialty">
						<FontAwesomeIcon icon={faStethoscope} className="doctor-card__icon" />
						{doctor.specialty}
					</p>
					{renderRating()}
				</div>
			</div>

			<div className="doctor-card__details">
				<div className="doctor-card__detail">
					<FontAwesomeIcon icon={faCalendarAlt} className="doctor-card__icon" />
					<span>{formatSchedule(doctor.schedule)}</span>
				</div>
				<div className="doctor-card__detail">
					<FontAwesomeIcon icon={faClock} className="doctor-card__icon" />
					<span>{doctor.workingHours || "09:00 - 18:00"}</span>
				</div>
			</div>

			{doctor.description && (
				<div className="doctor-card__description">
					{doctor.description.length > 120
						? `${doctor.description.substring(0, 120)}...`
						: doctor.description}
				</div>
			)}

			<div className="doctor-card__actions">
				<button className="doctor-card__book-btn" onClick={onBookAppointment}>
					Записаться на прием
				</button>
			</div>
		</div>
	);
};

DoctorCard.propTypes = {
	doctor: PropTypes.shape({
		id: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		middleName: PropTypes.string,
		specialty: PropTypes.string.isRequired,
		photo: PropTypes.string,
		schedule: PropTypes.object.isRequired,
		workingHours: PropTypes.string,
		description: PropTypes.string,
		rating: PropTypes.number,
	}).isRequired,
	onBookAppointment: PropTypes.func.isRequired,
};

export default DoctorCard;
