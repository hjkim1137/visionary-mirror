import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdDashboardCustomize } from 'react-icons/md';
import { IoImages } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import styles from './Nav.module.scss';

function Nav({ isOpen, isLoggedIn }) {
  if (!isOpen) {
    return null;
  }

  return (
    <nav className={isOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}>
      <ul className={styles.navListWrapper}>
        <li>
          <Link to="/" className={styles.navLink}>
            <AiFillHome size={29} />
            <span>홈</span>
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li id={styles.navMake}>
              <Link to="/getsampleboard" className={styles.navLink}>
                <MdDashboardCustomize size={29} />
                <span>비전보드 만들기</span>
              </Link>
            </li>
            <li>
              <Link to="/myvisionboard" className={styles.navLink}>
                <IoImages size={29} />
                <span>내 비전보드</span>
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/search" className={styles.navLink}>
            <FaSearch size={29} />
            <span>탐색</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
