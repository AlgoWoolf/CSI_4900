import React from 'react';
import { Link } from 'react-router-dom';
import "../css/Navbar.css"

function NavBar() {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '1rem' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/pageA">Page A</Link></li>
        <li><Link to="/pageB">Page B</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
