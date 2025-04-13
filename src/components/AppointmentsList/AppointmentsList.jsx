import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/helpers";
import "./AppointmentsList.scss";

const AppointmentsList = () => {
	const appointments = useSelector((state) => state.appointments.appointments);
	const { currentUser } = useSelector((state) => state.auth);
	const doctors = useSelector((state) => state.doctors.doctors);
	const loading = useSelector((state) => state.doctors.loading);

	const patientAppointments = appointments.filter((app) => app.patientId === currentUser?.id);

	const getDoctorInfo = (doctorId) => {
		const doctor = doctors.find((d) => d.id === doctorId);

		if (!doctor) {
			console.error("Врач не найден для записи:", doctorId);
			console.log("Доступные врачи:", doctors);
			return null;
		}

		return {
			fullName: `${doctor.lastName} ${doctor.firstName} ${doctor.middleName}`,
			specialty: doctor.specialty,
			photo: doctor.photo,
		};
	};

	if (loading) {
		return <div className="loading-message">Загрузка данных врачей...</div>;
	}

	if (doctors.length === 0) {
		return <div className="error-message">Список врачей не загружен</div>;
	}

	return (
		<div className="appointments-list">
			<h2>Мои записи</h2>
			{patientAppointments.length === 0 ? (
				<p className="empty-message">У вас нет активных записей</p>
			) : (
				<div className="appointments-container">
					{patientAppointments.map((app) => {
						const doctor = getDoctorInfo(app.doctorId);

						return (
							<div key={app.id} className={`appointment-card ${app.status}`}>
								<div className="appointment-header">
									{doctor ? (
										<>
											<div className="doctor-info">
												{doctor.photo && (
													<img
														src={doctor.photo}
														alt={doctor.fullName}
														className="doctor-avatar"
													/>
												)}
												<div>
													<h3>{doctor.fullName}</h3>
													<p className="specialty">{doctor.specialty}</p>
												</div>
											</div>
										</>
									) : (
										<div className="doctor-error">
											<h3>Врач не найден (ID: {app.doctorId})</h3>
										</div>
									)}

									<span className={`status-badge ${app.status}`}>
										{app.status === "scheduled"
											? "Запланировано"
											: app.status === "completed"
											? "Завершено"
											: "Отменено"}
									</span>
								</div>

								<div className="appointment-details">
									<p>
										<strong>Дата:</strong> {formatDate(app.date)}, {app.time}
									</p>
									{app.diagnosis && (
										<p>
											<strong>Диагноз:</strong> {app.diagnosis}
										</p>
									)}
									{app.prescription && (
										<p>
											<strong>Рекомендации:</strong> {app.prescription}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default AppointmentsList;