import React, { useState, useEffect } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import api from '../api/api';

const BorrowedBooksList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all
  useEffect(() => {
    const fetchData = async () => {
      try {
        const borrowedResponse = await api.get('/borrowed-books');
        setBorrowedBooks(borrowedResponse.data);

        const booksResponse = await api.get('/books');
        setBooks(booksResponse.data);

        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  const handleReturnBook = async (id) => {
    try {
      await api.put(`/borrowed-books/${id}/return`);
      
      // Update list
      const updatedBooks = borrowedBooks.map(
        (book) => book.id === id ? { ...book, status: 'returned' } : book
      );

      setBorrowedBooks(updatedBooks);
      alert('Книга успешно возвращена!');
    } catch (error) {
      console.error('Ошибка при возврате книги:', error);
      alert('Не удалось вернуть книгу');
    }
  };

  const getBookTitle = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    return book ? book.title : '?';
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : '?';
  };

  return (
    <Card className='my-4'>
      <Card.Header>Список взятых книг</Card.Header>
      <Card.Body>
        <Table>
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
                      Возвращена
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

    </Card>
  );
};

export default BorrowedBooksList;