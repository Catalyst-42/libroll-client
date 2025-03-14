import { Container, Alert } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './components/Pages/HomePage';
import Login from './components/Forms/Login';

import AddBook from './components/Forms/AddBook';
import AddUser from './components/Forms/AddUser';
import AddBorrow from './components/Forms/AddBorrow';

import BooksList from './components/View/BooksList';
import UsersList from './components/View/UsersList';
import BorrowsList from './components/View/BorrowsList';

import store from './store';
import { useEffect, useState } from 'react';
import api from './api/api';

const App = () => {
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health');
        setDbError(false);
      } catch (error) {
        setDbError(error);
      }
    };

    checkHealth();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Container className="col-lg-10 mx-auto p-4 py-md-5">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/add-borrow" element={<AddBorrow />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/borrows" element={<BorrowsList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          {dbError && (
            <Alert variant="danger">
              <Alert.Heading>{dbError.message}.</Alert.Heading>
              <p className='mb-0'>
                Мы не можем подключиться к базе данных в данный момент. <br />
                Пожалуйста, попробуйте снова позже.
              </p>
            </Alert>
          )}
        </Container>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
