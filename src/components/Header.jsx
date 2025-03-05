import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
  const [theme, setTheme] = useState(
    document.body.getAttribute('data-bs-theme')
  );

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (
      prevTheme === 'light' ? 'dark' : 'light')
    );
  };

  return (
    <Navbar className="bg-body-secondary border rounded">
      <Container>
        <Nav className="me-auto">
          <Navbar.Brand className='pt-1' style={{ cursor: 'pointer' }}>
            <span onClick={toggleTheme}>
            {Math.random() < 0.005 ? '⚏' : '⚍'}
            </span>
            <Link to="/" className="ms-2 text-decoration-none text-reset">
              Libroll
            </Link>
          </Navbar.Brand>
        </Nav>
        <Nav>
          <NavDropdown title="Добавление" id="create-dropdown">
            <NavDropdown.Item as={Link} to="/add-book">
              Книга
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/add-user">
              Пользователь
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/borrow-book">
              Займ
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Просмотр" id="view-dropdown">
            <NavDropdown.Item as={Link} to="/books">
              Книги
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/users">
              Пользователи
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/borrowed-books">
              Займы
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
