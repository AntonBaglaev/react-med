import React from "react";
import { useSelector } from "react-redux";
import Notification from "../Notification/Notification";

const PersistLoading = ({ children }) => {
	const authState = useSelector((state) => state.auth);
	const isLoading = useSelector((state) => state.auth.isLoading);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (authState.error) {
		return <Notification message={authState.error} type="error" />;
	}

	return children;
};

export default PersistLoading;
