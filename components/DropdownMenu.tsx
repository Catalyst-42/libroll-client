import React, { useState } from 'react';

interface DropdownMenuProps {
  title: string;
  links: { name: string, url: string }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button onClick={toggleMenu} className="dropdown-toggle">
        {title}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url}>{link.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
