import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка книг:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Container>
      <h2>Список всех книг</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Автор</th>
            <th>Количество</th>
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
    </Container>
  );
};

export default BooksList;
