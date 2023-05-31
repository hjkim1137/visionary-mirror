import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdDashboardCustomize } from 'react-icons/md';
import { IoImages } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import styles from './Nav.module.scss';

function Nav({ isOpen }) {
  if (!isOpen) {
    return null;
  }

  return (
    <nav className={isOpen ? `${styles.Nav} ${styles.NavOpen}` : styles.Nav}>
      <ul className={styles.NavListWrapper}>
        <li>
          <Link to="/" className={styles.NavLink}>
            <AiFillHome size={32} />홈
          </Link>
        </li>
        <li>
          <Link to="/makeboardname" className={styles.NavLink}>
            <MdDashboardCustomize size={32} />
            비전보드 만들기
          </Link>
        </li>
        <li>
          <Link to="/myvisionboard" className={styles.NavLink}>
            <IoImages size={32} />내 비전보드
          </Link>
        </li>
        <li>
          <Link to="/search" className={styles.NavLink}>
            <FaSearch size={32} />
            탐색
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
