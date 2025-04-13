import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectDoctorAppointments, completeAppointment, cancelAppointment } from "../../store/slices/appointmentsSlice";
import { selectPatientById } from "../../store/selectors";
import { formatDate } from "../../utils/helpers";
import { showNotification } from "../../store/slices/notificationSlice";
import "./DoctorCabinet.scss";

const DoctorCabinet = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.auth.currentUser);
	const appointments = useSelector(selectDoctorAppointments(currentUser?.id));
	const patients = useSelector((state) => state.patients.patients);
	const loading = useSelector((state) => state.appointments.status === "loading");

	const getPatientFullName = (appointment) => {
		if (appointment.patientName) return appointment.patientName;
		if (appointment.patientData) {
		  return `${appointment.patientData.firstName || ''} ${appointment.patientData.lastName || ''}`.trim();
		}
		return `Пациент ${appointment.patientId.slice(0, 6)}`;
	  };

	const getPatientInfo = (patientId) => {
		const patient = patients.find((p) => p.id === patientId) || {};
		return {
			fullName:
				`${patient.firstName || ""} ${patient.lastName || ""}`.trim() || `Пациент ${patientId.slice(0, 6)}`,
			birthDate: patient.birthDate,
			phone: patient.phone,
		};
	};

	const handleComplete = (appointmentId) => {
		const diagnosis = prompt("Введите диагноз:");
		if (diagnosis === null) return;

		const prescription = prompt("Введите рекомендации:");
		dispatch(
			completeAppointment({
				id: appointmentId,
				diagnosis,
				prescription,
			})
		);
		dispatch(
			showNotification({
				type: "success",
				message: "Прием успешно завершен",
			})
		);
	};

	const handleCancel = (appointmentId) => {
		const reason = prompt("Укажите причину отмены:");
		if (reason === null) return;

		dispatch(
			cancelAppointment({
				id: appointmentId,
				reason,
			})
		);
		dispatch(
			showNotification({
				type: "success",
				message: "Запись успешно отменена",
			})
		);
	};

	if (!currentUser || currentUser.role !== "doctor") {
		return (
			<div className="cabinet-container unauthorized">
				<h1>Доступ ограничен</h1>
				<p>Только авторизованные врачи могут просматривать эту страницу</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="cabinet-container loading">
				<div className="spinner"></div>
				<p>Загрузка данных...</p>
			</div>
		);
	}

	return (
		<div className="cabinet-container doctor-cabinet">
			<div className="cabinet-header">
				<h1>Кабинет врача</h1>
				<h2>
					Добро пожаловать, {currentUser.firstName} {currentUser.lastName}
				</h2>
			</div>

			<div className="appointments-section">
				<h3>Записи пациентов</h3>

				{appointments.length === 0 ? (
					<div className="empty-state">
						<img src="/images/no-appointments.svg" alt="Нет записей" />
						<p>Нет запланированных приемов</p>
					</div>
				) : (
					<div className="appointments-list">
						{appointments
							.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
							.map((appointment) => {
								const patientInfo = getPatientInfo(appointment.patientId);

								return (
									<div key={appointment.id} className={`appointment-card ${appointment.status}`}>
										<div className="card-header">
											<div className="patient-avatar">
												{patientInfo.fullName.charAt(0).toUpperCase()}
											</div>
											<div className="patient-info">
												<h4>{patientInfo.fullName}</h4>
												{patientInfo.birthDate && (
													<p className="patient-meta">
														{new Date().getFullYear() -
															new Date(patientInfo.birthDate).getFullYear()}{" "}
														лет
													</p>
												)}
											</div>
											<span className={`status-badge ${appointment.status}`}>
												{appointment.status === "scheduled"
													? "Запланировано"
													: appointment.status === "completed"
													? "Завершено"
													: "Отменено"}
											</span>
										</div>

										<div className="card-body">
											<div className="appointment-meta">
												<div className="meta-item">
													<span className="meta-label">Дата и время:</span>
													<span>
														{formatDate(appointment.date)}, {appointment.time}
													</span>
												</div>
												<div className="meta-item">
													<span className="meta-label">Специальность:</span>
													<span>{appointment.specialty}</span>
												</div>
												{patientInfo.phone && (
													<div className="meta-item">
														<span className="meta-label">Телефон:</span>
														<span>{patientInfo.phone}</span>
													</div>
												)}
											</div>

											{appointment.diagnosis && (
												<div className="appointment-details">
													<h5>Диагноз:</h5>
													<p>{appointment.diagnosis}</p>
												</div>
											)}

											{appointment.prescription && (
												<div className="appointment-details">
													<h5>Рекомендации:</h5>
													<p>{appointment.prescription}</p>
												</div>
											)}

											{appointment.cancellationReason && (
												<div className="appointment-details">
													<h5>Причина отмены:</h5>
													<p>{appointment.cancellationReason}</p>
												</div>
											)}
										</div>

										{appointment.status === "scheduled" && (
											<div className="card-actions">
												<button
													onClick={() => handleComplete(appointment.id)}
													className="btn primary"
												>
													Завершить прием
												</button>
												<button
													onClick={() => handleCancel(appointment.id)}
													className="btn secondary"
												>
													Отменить запись
												</button>
											</div>
										)}
									</div>
								);
							})}
					</div>
				)}
			</div>
		</div>
	);
};

export default DoctorCabinet;
