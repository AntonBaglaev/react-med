import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { faCalendarAlt, faUser, faChartLine, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../store/slices/authSlice";
import DoctorInfo from "../../components/doctor/DoctorInfo/DoctorInfo";
import Navigation from "../../components/common/Navigation/Navigation";
import Button from "../../components/common/Button/Button";
import LoadingScreen from "../../components/common/LoadingScreen/LoadingScreen";
import Notification from "../../components/common/Notification/Notification";
import "./DoctorCabinet.scss";

const DoctorCabinet = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const currentUser = useSelector((state) => state.auth.currentUser);
	const { doctors, loading, error } = useSelector((state) => state.data);

	const [activeTab, setActiveTab] = useState("appointments");
	const [notification, setNotification] = useState(null);

	// Находим текущего врача
	const doctor = doctors?.find((d) => d.id === currentUser?.id);

	// Определяем активную вкладку на основе URL
	useEffect(() => {
		const currentTab = location.pathname.split("/").pop();
		if (currentTab && navItems.some((item) => item.path === currentTab)) {
			setActiveTab(currentTab);
		}
	}, [location]);

	const navItems = [
		{
			id: "appointments",
			label: "Записи",
			icon: faCalendarAlt,
			path: "appointments",
		},
		{
			id: "patients",
			label: "Пациенты",
			icon: faUser,
			path: "patients",
		},
		{
			id: "stats",
			label: "Статистика",
			icon: faChartLine,
			path: "stats",
		},
		{
			id: "settings",
			label: "Настройки",
			icon: faCog,
			path: "settings",
		},
	];

	const handleLogout = () => {
		dispatch(logout());
		navigate("/auth");
	};

	if (loading) {
		return <LoadingScreen message="Загрузка данных врача..." />;
	}

	if (error) {
		return (
			<Notification
				message={`Ошибка загрузки данных: ${error}`}
				type="error"
				onClose={() => window.location.reload()}
			/>
		);
	}

	if (!doctor) {
		return (
			<div className="doctor-cabinet__error">
				<p>Данные врача не найдены</p>
				<Button onClick={() => navigate("/auth")}>Вернуться к авторизации</Button>
			</div>
		);
	}

	return (
		<div className="doctor-cabinet">
			{notification && (
				<Notification
					message={notification.message}
					type={notification.type}
					onClose={() => setNotification(null)}
				/>
			)}

			<div className="doctor-cabinet__header">
				<h1 className="doctor-cabinet__title">Кабинет врача</h1>
				<Button onClick={handleLogout} icon={faSignOutAlt} variant="text" className="doctor-cabinet__logout">
					Выйти
				</Button>
			</div>

			<div className="doctor-cabinet__content">
				<div className="doctor-cabinet__sidebar">
					<DoctorInfo doctor={doctor} />
					<Navigation
						items={navItems}
						activeTab={activeTab}
						onTabChange={(tab) => {
							setActiveTab(tab);
							navigate(tab);
						}}
						vertical
					/>
				</div>

				<div className="doctor-cabinet__main">
					<Outlet context={{ doctor, setNotification }} />
				</div>
			</div>
		</div>
	);
};

export default DoctorCabinet;
