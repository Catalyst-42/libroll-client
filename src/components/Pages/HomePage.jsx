import React, { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';

import api from '../../api/api';

const HomePage = () => {
  const [stats, setStats] = useState({});
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
        setDbError(false);
      } catch (error) {
        setDbError(error);
        console.error('Ошибка при загрузке статистики:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className='px-0'>
      <h5 className='mt-3 mb-0'>О нас</h5>
      <hr className='mt-0' />
      <p>
        Libroll — это веб-приложение для управления выдачей и возвратом книг в библиотеке. Оно предназначено для упрощения работы с книгами и пользователями, а также для автоматизации процессов учёта. Приложение предоставляет интерфейс, который позволяет легко добавлять книги, регистрировать новых пользователей, отслеживать взятые книги и управлять их возвратом.
      </p>

      {dbError ? (
        <Alert variant="danger">
          <Alert.Heading>{dbError.message}.</Alert.Heading>
          <p className='mb-0'>
            Мы не можем подключиться к базе данных в данный момент. <br />
            Пожалуйста, попробуйте зайти снова позже.
          </p>
        </Alert>
      ) : (
        <>
          <h5 className='mb-0'>Статистика приложения</h5>
          <hr className='mt-0' />
          <ul>
            <li>Всего книг: {stats.booksCount}</li>
            <li>Всего пользователей: {stats.usersCount}</li>
            <li>Книг занято: {stats.borrowsCount}</li>
            <li>Из них активных: {stats.activeBorrowsCount}</li>
            <li>И неактивных: {stats.inactiveBorrowsCount}</li>
          </ul>
        </>
      )}
    </Container>
  );
};

export default HomePage;
