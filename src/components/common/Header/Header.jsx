import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

	const handleLogout = async () => {
		try {
			await dispatch(logout()).unwrap();

			navigate("/", { replace: true });

			window.location.reload();
		} catch (error) {
			console.error("Ошибка при выходе:", error);
		}
	};

	return (
		<header className="header">
			<div className="header__container">
				<Link to="/" className="header__logo">
					Медицинский Центр
				</Link>
				<nav className="header__nav">
					{isAuthenticated && (
						<>
							<Link to="/doctors" className="header__nav-link">
								Врачи
							</Link>
							{currentUser?.role === "patient" && (
								<Link to="/patient-cabinet" className="header__nav-link">
									Мой кабинет
								</Link>
							)}
							{currentUser?.role === "doctor" && (
								<Link to="/doctor-cabinet" className="header__nav-link">
									Мой кабинет
								</Link>
							)}
						</>
					)}
				</nav>
				{isAuthenticated ? (
					<div className="header__user">
						<span className="header__user-name">
							<FontAwesomeIcon icon={faUser} /> {currentUser?.firstName} {currentUser?.lastName}
						</span>
						<Button variant="outline" size="small" onClick={handleLogout} icon={faSignOutAlt}>
							Выйти
						</Button>
					</div>
				) : (
					<Link to="/auth" className="header__auth-link">
						Войти
					</Link>
				)}
			</div>
		</header>
	);
};

export default Header;
