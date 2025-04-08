import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { faCalendarAlt, faUserMd } from '@fortawesome/free-solid-svg-icons';

import './Home.scss';

const Home = () => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const specialties = useSelector((state) => state.data.specialties);
  const doctors = useSelector((state) => state.data.doctors);

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">Медицинский Центр</h1>
          <p className="home__subtitle">
            Профессиональная медицинская помощь в удобное для вас время
          </p>
          {isAuthenticated ? (
            currentUser.role === 'patient' ? (
              <Link to="/doctors">
                <Button size="large" icon={faCalendarAlt}>
                  Записаться на прием
                </Button>
              </Link>
            ) : (
              <Link to="/doctor-cabinet">
                <Button size="large" icon={faUserMd}>
                  Мой кабинет
                </Button>
              </Link>
            )
          ) : (
            <Link to="/auth">
              <Button size="large">Войти в систему</Button>
            </Link>
          )}
        </div>
      </section>

      <section className="home__specialties">
        <h2 className="home__section-title">Наши специализации</h2>
        <div className="home__specialties-grid">
          {specialties.slice(0, 4).map((specialty) => (
            <div key={specialty.id} className="home__specialty-card">
              <h3 className="home__specialty-title">{specialty.name}</h3>
              <p className="home__specialty-text">
                {doctors.filter((d) => d.specialty === specialty.name).length}{' '}
                специалистов
              </p>
              <Link
                to="/doctors"
                state={{ specialty: specialty.name }}
                className="home__specialty-link"
              >
                Посмотреть врачей
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="home__doctors">
        <h2 className="home__section-title">Наши врачи</h2>
        <div className="home__doctors-grid">
          {doctors.slice(0, 3).map((doctor) => (
            <div key={doctor.id} className="home__doctor-card">
              <img
                src={doctor.photo}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                className="home__doctor-photo"
              />
              <h3 className="home__doctor-name">
                {doctor.lastName} {doctor.firstName} {doctor.middleName}
              </h3>
              <p className="home__doctor-specialty">{doctor.specialty}</p>
              <Link
                to={`/doctors#${doctor.id}`}
                className="home__doctor-link"
              >
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;