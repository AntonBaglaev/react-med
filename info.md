## Структура проекта
```
medical-center/
├── public/                  # Статические файлы
│   ├── index.html           # Основной HTML файл
│   └── favicon.ico          # Иконка сайта
│
├── src/
│   │
│   ├── components/          # Компоненты
|   |   |__ AppointmentsList/
|   |   |   |__ AppointmentsList.jsx
|   |   |
│   │   ├── auth/            # Компоненты аутентификации
│   │   │   ├── AuthForm/    # Форма входа/регистрации
|   |   |   |   |__AuthForm.jsx
|   |   |   |   |__AuthForm.scss
│   │   │   └── AuthSwitch/  # Переключатель между формами
│   │   │       |__AuthSwitch.jsx
|   |   |       |__AuthSwitch.scss
│   │   ├── common/          # Общие компоненты
│   │   │   ├── Button/      # Кнопка
|   |   |   |   |__Button.jsx
|   |   |   |   |__Button.scss
│   │   │   ├── DatePicker/  #
|   |   |   |   |__DataPicker.jsx
|   |   |   |   |__DataPicker.scss
│   │   │   ├── Header/      # Шапка сайта
|   |   |   |   |__Header.jsx
|   |   |   |   |__Header.scss
│   │   │   ├── Footer/      # Подвал сайта
|   |   |   |   |__Footer.jsx
|   |   |   |   |__Footer.scss
│   │   │   ├── Input/       # Поле ввода
|   |   |   |   |__Input.jsx
|   |   |   |   |__Input.scss
|   |   |   |__ LoadingScreen
|   |   |   |   |__LoadingScreen.jsx
|   |   |   |   |__LoadingScreen.scss
│   │   │   ├── Modal/       # Модальное окно
|   |   |   |   |__Modal.jsx
|   |   |   |   |__Modal.scss
│   │   │   ├── Navigation/  # Навигация
|   |   |   |   |__Navigation.jsx
|   |   |   |   |__Navigation.scss
│   │   │   ├── Notificatiion/  #
|   |   |   |   |__Notification.jsx
|   |   |   |   |__Notification.scss
│   │   │   ├── Select/      # Выпадающий список
|   |   |   |   |__Select.jsx
|   |   |   |   |__Select.scss
│   │   │   |── TimeSlotPicker
|   |   |   |   |__TimeSlotPicker.jsx
|   |   |   |   |__TimeSlotPicker.scss
│   │   │
│   │   ├── doctor/          # Компоненты врача
│   │   │   ├── DoctorCard/  # Карточка врача
|   |   |   |   |__DoctorCard.jsx
|   |   |   |   |__DoctorCard.scss
│   │   │   ├── DoctorInfo/  # Информация о враче
|   |   |       |__DoctorInfo.jsx
|   |   |       |__DoctorInfo.scss
│   │   │
│   │   |── patient/         # Компоненты пациента
│   │   |    ├── PatientInfo/ # Информация о пациенте
|   |   |        |__PatientInfo.jsx
|   |   |        |__PatientInfo.jsx
|   |   |__PersistLoading.jsx
│   │
│   ├── hooks/               # Кастомные хуки
│   │   ├── useLocalStorage.js # Работа с localStorage
│   │   └── useAuth.js       # Логика аутентификации
│   │
│   ├── pages/               # Страницы приложения
│   │   ├── Home/            # Главная страница
|   |   |   |__Home.jsx
|   |   |   |__Home.scss
│   │   ├── Doctors/         # Список врачей
|   |   |   |__Doctors.jsx
|   |   |   |__Doctors.scss
│   │   ├── DoctorCabinet/   # Кабинет врача
|   |   |   |__DoctorCabinet.jsx
|   |   |   |__DoctorCabinet.scss
│   │   ├── PatientCabinet/  # Кабинет пациента
|   |   |   |__PatientCabinet.jsx
|   |   |   |__PatientCabinet.scss
│   │   ├── Auth/            # Страница аутентификации
|   |   |   |__Auth.jsx
|   |   |   |__Auth.scss
│   │   |── NotFound/        # Страница 404
|   |   |   |__NotFound.jsx
|   |   |   |__NotFound.scss
│   │
│   ├── store/               # Redux хранилище
│   │   ├── slices/          # Redux слайсы
│   │   │   ├── appointmentsSlice.js #
│   │   │   ├── authSlice.js # Аутентификация
│   │   │   ├── dataSlice.js # Тестовые данные
│   │   │   ├── doctorSlice.js #
│   │   │   ├── notificationSlice.js #
│   │   │   ├── patientSlice.js #
│   │   │   ├── specialitesSlice.js #
│   │   │
│   │   ├── selectors.js     # Селекторы для Redux
│   │   └── store.js         # Конфигурация хранилища
│   │
│   ├── utils/               # Вспомогательные функции
│   │   ├── constants.js     # Константы приложения
│   │   ├── helpers.js       # Вспомогательные функции
│   │   └── storage.js       # Работа с хранилищем
│   │
│   ├── App.js               # Корневой компонент
│   ├── AppRouter.js         # Маршрутизация
│   ├── index.js             # Точка входа
│   └── setupTests.js        # Настройка тестов
│
├── .gitignore               # Игнорируемые файлы Git
├── package.json             # Зависимости и скрипты
├── README.md                # Описание проекта
└── yarn.lock                # Версии зависимостей
```
## Основные файлы и их назначение:

1. Redux хранилище (store/):

- authSlice.js - управление аутентификацией (логин/регистрация)
- dataSlice.js - централизованное хранение всех данных (врачи, пациенты и т.д.)
- store.js - конфигурация Redux с Persist для сохранения в localStorage

2. Компоненты (components/):

- auth/ - формы входа и регистрации
- common/ - переиспользуемые UI-компоненты
- doctor/ и patient/ - специализированные компоненты для разных ролей

3. Страницы (pages/):

- Разделение на публичные (Home, Auth) и приватные (кабинеты)
- Каждая страница имеет свою папку с JSX и SCSS файлами

4. Утилиты (utils/):

- constants.js - тестовые данные и константы
- helpers.js - вспомогательные функции (форматирование дат и т.д.)

5. Системные файлы:

- AppRouter.js - настройка маршрутов с защитой приватных путей
- index.js - точка входа с подключением Redux Provider

## Ключевые особенности архитектуры:

1. Разделение по функциональности:

- Аутентификация (auth) отдельно от данных (data)
- Компоненты разделены по ролям (врач/пациент)

2. Единое хранилище данных:

- Все данные через dataSlice
- Селекторы для удобного доступа

3. Persist middleware:

- Автоматическое сохранение в localStorage
- Восстановление состояния при перезагрузке

4. Гибкая система компонентов:

- Переиспользуемые UI-компоненты
- Специализированные компоненты для разных ролей

5. Обработка ошибок:

- В формах аутентификации
- В Redux actions

Эта структура обеспечивает:

- Четкое разделение ответственности
- Масштабируемость
- Удобство поддержки
- Согласованность кода
- Сохранение состояния между сессиями

## Тестовые данные

1. При первом запуске приложения необходимо инициализировать тестовые данные:
2. Перейдите на страницу авторизации (/auth)
3. Нажмите кнопку "Инициализировать тестовые данные" внизу формы
4. После этого можно войти под тестовыми пользователями:
5. Врач: email: doctor1@example.com, пароль: doctor1
6. Пациент: email: patient1@example.com, пароль: patient1

## Особенности реализации

1. Хранение данных: Все данные хранятся в localStorage с помощью redux-persist
2. Авторизация: Реализована система ролей (врач/пациент) с разными интерфейсами
3. Личные кабинеты: Раздельные интерфейсы для врачей и пациентов с навигацией по разделам
4. Запись на прием: Возможность выбора даты и времени с учетом графика работы врача
5. Фильтрация: Фильтрация врачей по специальностям и поиск по имени
6. Адаптивный дизайн: Все компоненты адаптированы под разные размеры экранов
7. БЭМ: Использована методология БЭМ для именования классов
8. Font Awesome: Использованы иконки из Font Awesome

Проект готов к дальнейшему расширению функционала и подключению реального бэкенда.