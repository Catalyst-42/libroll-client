import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import api from '../../api/api';

const BorrowsList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const token = useSelector((state) => state.auth.token);

  // Fetch all
  useEffect(() => {
    const fetchData = async () => {
      try {
        const borrowedResponse = await api.get('/borrows');
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
  }, [token]);

  const handleReturnBook = async (id) => {
    try {
      await api.put(`/borrows/${id}/return`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

  const formatDate = (dateString) => {
    return moment(dateString).format('DD.MM.YYYY');
  };

  const filteredBooks = borrowedBooks.filter((book) => {
    const bookTitle = getBookTitle(book.book_id).toLowerCase();
    const userName = getUserName(book.user_id).toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (bookTitle.includes(searchTermLower) || userName.includes(searchTermLower)) &&
      (filterStatus ? book.status === filterStatus : true)
    );
  });

  return (
    <>
      <Card className='my-4'>
        <Card.Header>Фильтры</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Form.Group as={Col} controlId="search">
                <Form.Label>Имена</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Книга или пользователь"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="filterStatus">
                <Form.Label>Статус</Form.Label>
                <Form.Control
                  as="select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Все</option>
                  <option value="active">Активные</option>
                  <option value="returned">Возвращенные</option>
                </Form.Control>
              </Form.Group>
            </Row>
          </Form>
        </Card.Body>
      </Card>
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
              {filteredBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>{getBookTitle(book.book_id)}</td>
                  <td>{getUserName(book.user_id)}</td>
                  <td>{formatDate(book.borrow_date)}</td>
                  <td>{formatDate(book.return_date)}</td>
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
    </>
  );
};

export default BorrowsList;