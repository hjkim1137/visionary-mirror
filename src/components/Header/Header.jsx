import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

//import { MdLogin } from 'react-icons/Md';
import Logo from './Logo';
import Hamburger from './Hamburger';
import Nav from './Nav';
import styles from './Header.module.scss';

function Header({ isLogin, setIsLogin }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 햄버거 메뉴 떠있는지 여부

  // Nav 열림 조절
  const handleMenu = () => {
    setIsOpen(!isOpen); // 햄버거 메뉴 떠있는지 여부 조절
  };

  const navigateHome = () => {
    navigate('/');
  };

  const logout = async () => {
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
        setIsLogin(false);
        localStorage.setItem('isLogin', 0);
        navigate('/');
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
              <Nav isOpen={isOpen} isLoggedIn={isLogin} />
            </li>
            <li onClick={navigateHome}>
              <Link to="/" className={styles.iconWrapper}>
                <Logo className="logoImage" />
              </Link>
            </li>
            <li>
              {isLogin ? (
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
