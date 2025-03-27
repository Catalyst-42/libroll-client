import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, InputGroup, Row, Col } from 'react-bootstrap';

import api from '../../api/api';

const AddBorrow = ({ show, handleClose, borrowToEdit, refreshBorrows }) => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        const usersResponse = await api.get('/users');

        setBooks(booksResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (borrowToEdit) {
      setBookId(borrowToEdit.book_id);
      setUserId(borrowToEdit.user_id);
      setBorrowDate(moment(borrowToEdit.borrow_date).format('YYYY-MM-DD'));
      setReturnDate(borrowToEdit.return_date ? moment(borrowToEdit.return_date).format('YYYY-MM-DD') : '');
      setStatus(borrowToEdit.status);
    } else {
      setBookId('');
      setUserId('');
      setBorrowDate('');
      setReturnDate('');
      setStatus('active');
    }
  }, [borrowToEdit]);

  // Time buttons logic
  const setTodayDate = () => {
    const today = moment().format('YYYY-MM-DD');
    setBorrowDate(today);
  };

  const setReturnDateInA2Week = () => {
    const next_week = moment().add(14, 'days').format('YYYY-MM-DD');
    setReturnDate(next_week);
  };

  const setReturnDateInAMonth = () => {
    const next_month = moment().add(1, 'month').format('YYYY-MM-DD');
    setReturnDate(next_month);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (moment(returnDate).isBefore(moment(borrowDate))) {
      setError('Дата возврата должна быть позже даты заёма книги.');
      return;
    }
    try {
      if (borrowToEdit) {
        await api.put(`/borrows/${borrowToEdit.id}`, {
          book_id: bookId,
          user_id: userId,
          borrow_date: borrowDate,
          return_date: returnDate,
          status: status,
        });
      } else {
        await api.post('/borrows', {
          book_id: bookId,
          user_id: userId,
          borrow_date: borrowDate,
          return_date: returnDate,
          status: status,
        });

        setBookId('');
        setUserId('');
        setBorrowDate('');
        setReturnDate('');
        setStatus('active');
      }

      handleClose();
      refreshBorrows();
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/borrows/${borrowToEdit.id}`);
      handleClose();
      refreshBorrows();
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{borrowToEdit ? 'Редактировать займ' : 'Добавить новый займ'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Book */}
          <Form.Group controlId="bookId" className='mb-3'>
            <Form.Label>Книга</Form.Label>
            <Form.Select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="">Выберите книгу</option>
              {books
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.author})
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* User */}
          <Form.Group controlId="userId">
            <Form.Label>Пользователь</Form.Label>
            <Form.Select
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
            </Form.Select>
          </Form.Group>

          {/* Borrow take and return dates */}
          <Row>
            <Form.Group as={Col} controlId="borrowDate" className='mt-3' style={{ minWidth: '30ch' }}>
              <Form.Label>Дата взятия</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  required
                  isInvalid={!!error}
                />
                <Button variant="secondary" onClick={setTodayDate}>
                  Сегодня
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId="returnDate" className='mt-3' style={{ minWidth: '30ch' }}>
              <Form.Label>Дата возврата</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  isInvalid={!!error}
                />
                <Button variant="secondary" onClick={setReturnDateInA2Week}>
                  2 Недели
                </Button>
                <Button variant="secondary" onClick={setReturnDateInAMonth}>
                  Месяц
                </Button>
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>

          {/* Status */}
          {borrowToEdit &&
            <Form.Group controlId="status" className='mt-3'>
              <Form.Label>
                Состояние займа
              </Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="active">Активный</option>
                <option value="returned">Возвращён</option>
                <option value="lost">Потерян</option>
              </Form.Select>
            </Form.Group>
          }

          <Button variant="primary" type="submit" className='mt-3'>
            {borrowToEdit ? 'Обновить' : 'Взять книгу'}
          </Button>
          {borrowToEdit && (
            <Button variant="danger" onClick={handleDelete} className="ms-2 mt-3">
              Удалить
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBorrow;
