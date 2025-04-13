import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { TEST_DOCTORS, TEST_PATIENTS } from "../../../utils/constants";

const AuthForm = ({ onSubmit, isLogin }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		phone: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isLogin) {
			onSubmit({ email: formData.email, password: formData.password });
		} else {
			onSubmit(formData);
		}
	};

	const fillTestDoctorData = () => {
		const doctor = TEST_DOCTORS[0];
		setFormData({
			email: doctor.email,
			password: doctor.password,
			firstName: doctor.firstName,
			lastName: doctor.lastName,
			phone: doctor.phone,
		});
	};

	const fillTestPatientData = () => {
		const patient = TEST_PATIENTS[0];
		setFormData({
			email: patient.email,
			password: patient.password,
			firstName: patient.firstName,
			lastName: patient.lastName,
			phone: patient.phone,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="auth-form">
			{isLogin && (
				<div className="test-data-buttons">
					<Button
						type="button"
						onClick={fillTestDoctorData}
						variant="outline"
						fullWidth
						className="test-data-btn"
					>
						Тестовый врач
					</Button>
					<Button
						type="button"
						onClick={fillTestPatientData}
						variant="outline"
						fullWidth
						className="test-data-btn"
					>
						Тестовый пациент
					</Button>
				</div>
			)}

			<Input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				icon={faEnvelope}
				required
			/>

			<Input
				type="password"
				name="password"
				placeholder="Пароль"
				value={formData.password}
				onChange={handleChange}
				icon={faLock}
				required
			/>

			{!isLogin && (
				<>
					<Input
						type="text"
						name="firstName"
						placeholder="Имя"
						value={formData.firstName}
						onChange={handleChange}
						required
					/>
					<Input
						type="text"
						name="lastName"
						placeholder="Фамилия"
						value={formData.lastName}
						onChange={handleChange}
						required
					/>
					<Input
						type="tel"
						name="phone"
						placeholder="Телефон"
						value={formData.phone}
						onChange={handleChange}
						required
					/>
				</>
			)}

			<Button type="submit" variant="primary" fullWidth>
				{isLogin ? "Войти" : "Зарегистрироваться"}
			</Button>
		</form>
	);
};

export default AuthForm;
