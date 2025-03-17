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

const App = () => {
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
        </Container>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
