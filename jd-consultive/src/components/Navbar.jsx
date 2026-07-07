import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    {
      path: '/',
      label: 'Home',
    },
    {
      path: '/services',
      label: 'Services',
    },
    {
      path: '/about',
      label: 'About Us',
    },
    {
      path: '/contact',
      label: 'Contact',
    },
  ];

  return (
    <header className="site-header">

      <div className="container">

        <nav className="nav">

          <Link
            to="/"
            className="brand"
          >
            <span className="brand-mark">
              J
            </span>

            <span>
              JD Consultive
            </span>
          </Link>

          <div className="nav-links">

            {navItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path
                    ? 'active'
                    : ''
                }`}
              >
                {item.label}
              </Link>

            ))}

          </div>

          <Link
            to="/contact"
            className="nav-cta"
          >
            Get in Touch
          </Link>

          <button
            className={`hamburger ${
              menuOpen ? 'open' : ''
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>

        </nav>

      </div>

      <div
        className={`mobile-menu ${
          menuOpen ? 'open' : ''
        }`}
      >

        {navItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className="mob-link"
            onClick={closeMenu}
          >
            {item.label}
          </Link>

        ))}

      </div>

    </header>
  );
}