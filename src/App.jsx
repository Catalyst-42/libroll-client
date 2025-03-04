import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

import AddBook from './components/AddBook';
import AddUser from './components/AddUser';
import BorrowBook from './components/BorrowBook';
import BorrowedBooksList from './components/BorrowedBooksList';
import BooksList from './components/BooksList';
import UsersList from './components/UsersList';
// import HomePage from './components/HomePage';

const App = () => {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Библиотека
          </Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown title="Создание записей" id="create-dropdown">
              <NavDropdown.Item as={Link} to="/add-book">
                Добавить книгу
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-user">
                Добавить пользователя
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/borrow-book">
                Взять книгу
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Просмотр записей" id="view-dropdown">
              <NavDropdown.Item as={Link} to="/borrowed-books">
                Список взятых книг
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/books">
                Список книг
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/users">
                Список пользователей
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/borrow-book" element={<BorrowBook />} />
          <Route path="/borrowed-books" element={<BorrowedBooksList />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
