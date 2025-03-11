import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { Pencil, Archive, Search } from 'react-bootstrap-icons';

import api from '../../api/api';
import AddBorrow from '../Forms/AddBorrow';

const BorrowsList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [borrowToEdit, setBorrowToEdit] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // Fetch all
  useEffect(() => {
    fetchData();
  }, [token]);

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
    } catch (error) {
      console.error('Ошибка при возврате книги:', error);
    }
  };

  const handleEdit = (borrow) => {
    setBorrowToEdit(borrow);
    setShowModal(true);
  };

  const handleAdd = () => {
    setBorrowToEdit(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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
      { /* Filters */ }
      <Row className='mb-4'>
        <Form.Group as={Col} sm={12} md={5} controlId="search" className='mt-4'>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Книга или пользователь"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} sm={12} md={4} controlId="filterStatus" className='mt-4'>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              as="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Любой статус</option>
              <option value="active">Активные</option>
              <option value="returned">Возвращенные</option>
            </Form.Control>
          </InputGroup>
        </Form.Group>

        {isAuthenticated &&
          <Col sm={12} md={3} className="d-flex align-items-end mt-4">
            <Button className="w-100" onClick={handleAdd}>Создать займ</Button>
          </Col>
        }
      </Row>

      <hr />

      {/* Taken books list */}
      <Card className='my-4'>
        <Card.Header>
          Список взятых книг
        </Card.Header>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Книга</th>
                <th>Пользователь</th>
                <th>Дата взятия</th>
                <th>Дата возврата</th>
                <th>Статус</th>
                {isAuthenticated && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>{getBookTitle(book.book_id)}</td>
                  <td>{getUserName(book.user_id)}</td>
                  <td>{formatDate(book.borrow_date)}</td>
                  <td>{formatDate(book.return_date)}</td>
                  <td>{book.status === "returned" ? "Возвращена" : "На руках"}</td>
                  {isAuthenticated &&
                    <td>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        <Pencil></Pencil>
                      </Button>
                      {book.status === 'active' && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleReturnBook(book.id)}
                        >
                          <Archive></Archive>
                        </Button>
                      )}
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <AddBorrow show={showModal} handleClose={handleClose} borrowToEdit={borrowToEdit} refreshBorrows={fetchData} />
    </>
  );
};

export default BorrowsList;