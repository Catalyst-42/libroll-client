import React from 'react';
import DropdownMenu from './DropdownMenu';

const Header: React.FC = () => {
  const createLinks = [
    { name: 'Создать запись 1', url: '/create/1' },
    { name: 'Создать запись 2', url: '/create/2' },
    // ...другие ссылки создания записей...
  ];

  const viewLinks = [
    { name: 'Просмотр записи 1', url: '/view/1' },
    { name: 'Просмотр записи 2', url: '/view/2' },
    // ...другие ссылки просмотра записей...
  ];

  return (
    <header>
      <nav>
        <DropdownMenu title="Создание записей" links={createLinks} />
        <DropdownMenu title="Просмотр записей" links={viewLinks} />
        // ...другие элементы навигации...
      </nav>
    </header>
  );
};

export default Header;
