import React from 'react';
import styles from './Logo.module.scss';
import logoImage from './font.png';

function Logo() {
  return <img src={logoImage} alt="logo" className={styles.logoImage} />;
}

export default Logo;
