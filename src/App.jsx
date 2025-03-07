import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import store from './store';

import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';

// Create
import AddBook from './components/AddBook';
import AddUser from './components/AddUser';
import BorrowBook from './components/BorrowBook';

// Inspect
import BooksList from './components/BooksList';
import UsersList from './components/UsersList';
import BorrowedBooksList from './components/BorrowedBooksList';

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
            <Route path="/borrow-book" element={<BorrowBook />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/borrowed-books" element={<BorrowedBooksList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
