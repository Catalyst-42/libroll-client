import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axiosInstance.get('/books');
        const usersResponse = await axiosInstance.get('/users');
        setBooks(booksResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  // Функция для установки сегодняшней даты
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setBorrowDate(today);
  };

  // Функция для установки даты возврата через неделю
  const setReturnDateInAWeek = () => {
    const today = new Date();
    const returnDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
    setReturnDate(returnDate);
  };

  // Функция для установки даты возврата через месяц
  const setReturnDateInAMonth = () => {
    const today = new Date();
    const returnDate = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
    setReturnDate(returnDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/borrowed-books', {
        book_id: bookId,
        user_id: userId,
        borrow_date: borrowDate,
        return_date: returnDate,
      });
      alert('Книга успешно взята!');
      setBookId('');
      setUserId('');
      setBorrowDate('');
      setReturnDate('');
    } catch (error) {
      console.error('Ошибка при взятии книги:', error);
    }
  };

  return (
    <Container>
      <h2>Взять книгу</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="bookId">
              <Form.Label>Книга</Form.Label>
              <Form.Control
                as="select"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                <option value="">Выберите книгу</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.author})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="userId">
              <Form.Label>Пользователь</Form.Label>
              <Form.Control
                as="select"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">Выберите пользователя</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Form.Group controlId="borrowDate">
              <Form.Label>Дата взятия</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="date"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Button variant="secondary" onClick={setTodayDate}>
                    Сегодня
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="returnDate">
              <Form.Label>Дата возврата</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Button variant="secondary" onClick={setReturnDateInAWeek} className="me-2">
                    Через неделю
                  </Button>
                  <Button variant="secondary" onClick={setReturnDateInAMonth}>
                    Через месяц
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Взять книгу
        </Button>
      </Form>
    </Container>
  );
};

export default BorrowBook;
