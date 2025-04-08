import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">
          Страница, которую вы ищете, не существует.
        </p>
        <Link to="/">
          <Button variant="primary">На главную</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;