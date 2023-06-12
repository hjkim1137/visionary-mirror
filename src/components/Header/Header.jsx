import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Logo from './Logo';
import Hamburger from './Hamburger';
import Nav from './Nav';
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 햄버거 메뉴 떠있는지 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 체크하여 useState에 설정
  const auth = getAuth();

  // Nav 열림 조절
  const handleMenu = () => {
    setIsOpen(!isOpen); // 햄버거 메뉴 떠있는지 여부 조절
  };

  const navigateHome = () => {
    navigate('/');
  };

  // 로그인 함수
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 로그아웃 함수
  const logout = async () => {
    // 로그아웃 시 Firebase auth signOut 함수 호출
    auth.signOut();
    localStorage.setItem('isLogin', '0'); // 로그아웃 후 로컬스토리지의 isLogin 값을 0으로 설정

    try {
      const res = await fetch('/api/v1/accounts/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.error) {
        console.log('Logout error:', data.error.message);
      } else {
        console.log('Logout 성공');
      }
    } catch (error) {
      console.error('logout 실패:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.listWrapper}>
          <ul>
            <li>
              <Hamburger
                className={styles.hamburger}
                clickHandler={handleMenu}
              />
              <Nav isOpen={isOpen} isLoggedIn={isLoggedIn} />
              {/* <Nav isOpen={true} isLoggedIn={isLoggedIn} /> 햄버거 항상 나오게*/}
            </li>
            <li onClick={navigateHome}>
              <Link to="/" className={styles.iconWrapper}>
                <Logo />
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <div className={styles.spacing}>
                  <button onClick={handleLogout}>Logout</button>
                  <button onClick={() => navigate('/accountedit')}>
                    My page
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/login')}>Login</button>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
