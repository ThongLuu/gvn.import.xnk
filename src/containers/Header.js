import React, { useState } from 'react';
import Button from '../components/button';

const Header = () => {
  // PARAMETER
  const [isOpen, setIsOpen] = useState(false);

  // FUNCTION
  // onclick navbar-menu function on mobile/ tablet screen
  const handleOpen = event => {
    setIsOpen(current => !current);
  };

  return (
    <header className='w-full bg-primary-1 sticky top-0 z-50'>
      hello
    </header>
  )
}

export default Header
