import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';

import api from '../../api/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка пользователей:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Card className='mt-4'>
      <Card.Header>Список всех пользователей</Card.Header>
      <Card.Body>
      <Table>
        <thead>
          <tr>
            <th>№</th>
            <th>Имя</th>
            <th>Фамилия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Card.Body>
    </Card>
  );
};

export default UsersList;
