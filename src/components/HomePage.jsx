import React, { useState, useEffect } from 'react';
import { Container} from 'react-bootstrap';
import api from '../api/api';

const HomePage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container>
      <h5 className='mt-3 mb-0'>О нас</h5>
      <hr className='mt-0' />
      <p>
        Libroll — это веб-приложение для управления выдачей и возвратом книг в библиотеке. Оно предназначено для упрощения работы с книгами и пользователями, а также для автоматизации процессов учёта. Приложение предоставляет интерфейс, который позволяет легко добавлять книги, регистрировать новых пользователей, отслеживать взятые книги и управлять их возвратом.
      </p>

      <h5 className='mb-0'>Статистика приложения</h5>
      <hr className='mt-0' />
      <ul>
        <li>Всего книг: {stats.booksCount}</li>
        <li>Всего пользователей: {stats.usersCount}</li>
        <li>Книг занято: {stats.borrowedBooksCount}</li>
        <li>Из них активных: {stats.activeBorrowedBooksCount}</li>
        <li>И неактивных: {stats.inactiveBorrowedBooksCount}</li>
      </ul>
    </Container>
  );
};

export default HomePage;
