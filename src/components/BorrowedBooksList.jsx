import React, { useState, useEffect } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

const BorrowedBooksList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]); // Список всех книг
  const [users, setUsers] = useState([]); // Список всех пользователей

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем список взятых книг
        const borrowedResponse = await axiosInstance.get('/borrowed-books');
        setBorrowedBooks(borrowedResponse.data);

        // Получаем список всех книг
        const booksResponse = await axiosInstance.get('/books');
        setBooks(booksResponse.data);

        // Получаем список всех пользователей
        const usersResponse = await axiosInstance.get('/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  // Функция для возврата книги
  const handleReturnBook = async (id) => {
    try {
      await axiosInstance.put(`/borrowed-books/${id}/return`);
      // Обновляем список после успешного возврата
      const updatedBooks = borrowedBooks.map((book) =>
        book.id === id ? { ...book, status: 'returned' } : book
      );
      setBorrowedBooks(updatedBooks);
      alert('Книга успешно возвращена!');
    } catch (error) {
      console.error('Ошибка при возврате книги:', error);
      alert('Не удалось вернуть книгу');
    }
  };

  // Функция для получения названия книги по её ID
  const getBookTitle = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    return book ? book.title : 'Неизвестная книга';
  };

  // Функция для получения имени пользователя по его ID
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Неизвестный пользователь';
  };

  return (
    <Container>
      <h2>Список взятых книг</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Книга</th>
            <th>Пользователь</th>
            <th>Дата взятия</th>
            <th>Дата возврата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{getBookTitle(book.book_id)}</td>
              <td>{getUserName(book.user_id)}</td>
              <td>{book.borrow_date}</td>
              <td>{book.return_date}</td>
              <td>{book.status}</td>
              <td>
                {book.status === 'active' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleReturnBook(book.id)}
                  >
                    Вернуть книгу
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default BorrowedBooksList;