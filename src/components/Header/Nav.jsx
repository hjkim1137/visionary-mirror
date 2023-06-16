import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdDashboardCustomize } from 'react-icons/md';
import { IoImages } from 'react-icons/io5';
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
            <AiFillHome size={33} />
            <span className={styles.navText}>홈</span>
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li id={styles.navMake}>
              <Link to="/getsampleboard" className={styles.navLink}>
                <MdDashboardCustomize size={35} />
                <span className={styles.navText}>비전보드 만들기</span>
              </Link>
            </li>
            <li>
              <Link to="/myvisionboard/list" className={styles.navLink}>
                <IoImages size={30} />
                <span className={styles.navText}>내 비전보드</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
