import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Form, Row, Col, Container, Button, InputGroup, Stack } from 'react-bootstrap';

import { Pencil, Search, Person } from 'react-bootstrap-icons';

import api from '../../api/api';
import AddUser from '../Forms/AddUser';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списка пользователей:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleEdit = (user) => {
    setUserToEdit(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setUserToEdit(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Row className='my-4'>
        <Form.Group as={Col}>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Имя или фамилия"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        {isAuthenticated &&
          <Col xs="auto" className="d-flex align-items-end">
            <Button onClick={handleAdd}>Добавить пользователя</Button>
          </Col>
        }
      </Row>

      <hr />

      {/* Users list */}
      <Container className='my-4 px-0'>
        <Row>
          {filteredUsers.map((user) => (
            <Col key={user.id} xs={12} md={6} lg={6} className="mb-4">
              <Card>
                <Card.Body className='py-1'>
                  <Stack direction="horizontal" gap={3}>
                    <Person size={24} />
                    <div className='vr'></div>
                    <div className='flex-grow-1'>
                      <Card.Text className='mb-0'>
                        {user.first_name} {user.last_name}
                      </Card.Text>
                      <Card.Text className='mb-0 text-secondary'>#{user.id}</Card.Text>
                    </div>

                    {isAuthenticated &&
                      <Button
                        variant="link"
                        onClick={() => handleEdit(user)}
                        className="text-warning btn-sm py-0"
                      >
                        <Pencil />
                      </Button>
                    }
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <AddUser show={showModal} handleClose={handleClose} userToEdit={userToEdit} refreshUsers={fetchUsers} />
    </>
  );
};

export default UsersList;