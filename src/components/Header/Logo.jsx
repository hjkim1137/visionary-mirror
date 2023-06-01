import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';
import logoImage from './font.png'; // 로고 이미지 경로

function Logo() {
  return (
    <Link to="/" className={styles.logoLink}>
      <img src={logoImage} alt="logo" className={styles.logoImage} />
    </Link>
  );
}

export default Logo;
