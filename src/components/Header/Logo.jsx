import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';
import logoImage from './font.png';

function Logo({ to = '/', className }) {
  return (
    <Link to={to} className={`${styles.logoLink} ${className}`}>
      <img src={logoImage} alt="logo" className={styles.logoImage} />
    </Link>
  );
}

export default Logo;
