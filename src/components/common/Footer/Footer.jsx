import React from 'react';
import { Link } from 'react-router-dom';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">Медицинский Центр</h3>
          <p className="footer__text">
            Современный медицинский центр с высококвалифицированными специалистами.
          </p>
        </div>
        <div className="footer__section">
          <h3 className="footer__title">Контакты</h3>
          <ul className="footer__contacts">
            <li>
              <FontAwesomeIcon icon={faPhone} /> +7 (123) 456-7890
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} /> info@medical-center.ru
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> г. Москва, ул. Медицинская, д. 15
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h3 className="footer__title">Навигация</h3>
          <ul className="footer__nav">
            <li>
              <Link to="/" className="footer__nav-link">
                Главная
              </Link>
            </li>
            <li>
              <Link to="/doctors" className="footer__nav-link">
                Врачи
              </Link>
            </li>
            <li>
              <Link to="/auth" className="footer__nav-link">
                Вход
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__copyright">
        &copy; {new Date().getFullYear()} Медицинский Центр. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;