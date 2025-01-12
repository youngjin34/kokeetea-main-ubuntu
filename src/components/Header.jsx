import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import style from './Header.module.css';

const Header = ({ currentPage }) => {
  const getHeaderColor = () => {
    switch (currentPage) {
      case 0:
        return 'transparent';
      case 1:
        return 'white';
      case 2:
        return 'transparent';
      case 3:
        return 'white';
      default:
        return 'transparent';
    }
  };

  const getFontColor = () => {
    switch (currentPage) {
      case 0:
        return 'white';
      case 1:
        return 'black';
      case 2:
        return 'white';
      case 3:
        return 'black';
      default:
        return 'white';
    }
  };

  return (
    <div
      className={`${style.Header} `}
      style={{ background: getHeaderColor(), transition: '0.7s' }}
    >
      {currentPage % 2 === 0 ? (
        <Link to="/">
          <img
            src="./images/logo_white.png"
            alt="logo"
            className={style.logo}
          />
        </Link>
      ) : (
        <Link to="/">
          <img
            src="./images/logo_black.png"
            alt="logo"
            className={style.logo}
          />
        </Link>
      )}
      <Navigation fontColor={getFontColor()} currentPage={currentPage} />
    </div>
  );
};

export default Header;
