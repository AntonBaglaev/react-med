import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Button.scss";

const Button = ({
	children,
	onClick,
	type = "button",
	variant = "primary",
	size = "medium",
	disabled = false,
	icon,
	className = "",
}) => {
	return (
		<button
			type={type}
			className={`btn btn--${variant} btn--${size} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && <FontAwesomeIcon icon={icon} className="btn__icon" />}
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
	size: PropTypes.oneOf(["small", "medium", "large"]),
	disabled: PropTypes.bool,
	icon: PropTypes.object,
	className: PropTypes.string,
};

export default Button;
