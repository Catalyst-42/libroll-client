import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';

import api from '../../api/api';

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка книг:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Card className='my-4'>
      <Card.Header>Список всех книг</Card.Header>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Название</th>
              <th>Автор</th>
              <th>Книг</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.total_count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default BooksList;
