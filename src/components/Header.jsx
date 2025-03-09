import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import Login from './Login';

const Header = () => {
  const [theme, setTheme] = useState(
    document.body.getAttribute('data-bs-theme')
  );
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (
      prevTheme === 'light' ? 'dark' : 'light')
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  return (
    <>
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
            {isAuthenticated && (
              <>
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
              </>
            )}
            <NavDropdown title="Просмотр" id="view-dropdown">
              <NavDropdown.Item as={Link} to="/books">
                Книги
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/users">
                Пользователи
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/borrows">
                Займы
              </NavDropdown.Item>
            </NavDropdown>

            {!isAuthenticated ? (
              <Button variant="outline-primary" onClick={handleLoginShow}>
                Войти
              </Button>
            ) : (
              <Button variant="outline-danger" onClick={handleLogout}>
                Выйти
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Login show={showLogin} handleClose={handleLoginClose} />
    </>
  );
};

export default Header;
