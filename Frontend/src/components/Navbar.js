import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import WalkthroughIcon from './WalkthroughIcon';
import './Navbar.css';
import { useLocale } from '../contexts/LocaleContext';

const walkthroughs = {
    Explore: "Search, filter, and discover Sikkim's monasteries. View details, read visitor reviews, and find your next destination.",
    Events: "Stay updated on vibrant cultural festivals and spiritual events. Book tickets and get event details here.",
    Maps: "Navigate your journey with our interactive map. Locate monasteries, nearby hotels, restaurants, and plan your travel routes.",
    Archives: "Access a digital library of sacred murals, ancient manuscripts, and priceless artifacts from monasteries across Sikkim.",
    Trivia: "Engage with our culture! Play the trivia challenge to test your knowledge about Sikkim's heritage and earn reward coins.",
    ContactUs: "Have a question or feedback? Find our contact details, connect with us on social media, and learn more about our mission."
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Explore', 'Events', 'Maps', 'Archives', 'Trivia', 'ContactUs'];
  const { t, locale, setLocale } = useLocale();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="main-navbar">
      <div className={isMenuOpen ? "nav-menu open" : "nav-menu"}>
        {navItems.map((item) => (
          <div key={item} className="nav-item-container">
            <NavLink
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              {item === 'ContactUs' ? t('ContactUs') : t(item)}
            </NavLink>
            <WalkthroughIcon text={walkthroughs[item]} />
          </div>
        ))}
      </div>
      <select
        className="locale-switcher"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label="Language selector"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="ne">नेपाली</option>
        <option value="skm">སིཀིམ་སྐད།</option>
      </select>
      <button className="nav-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;