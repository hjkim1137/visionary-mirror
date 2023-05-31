import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from './Logo';
import Hamburger from './Hamburger';
import Nav from './Nav';
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Nav 열림 조절
  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.listWrapper}>
        <ul>
          <li>
            <Hamburger clickHandler={handleMenu} />
            <Nav isOpen={isOpen} />
          </li>
          <li onClick={navigateHome}>
            <div className={styles.iconWrapper}>
              <Logo />
            </div>
          </li>
          <li>
            <a onClick={() => navigate('/login')}>로그인</a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

// 로고 등 여러 색과 세밀한 css는(호버 시 포인터 바뀜 등) 나중에
// 햄버거(네브는 옆에서 슬라이드), 로고(홈 이동), 로그인(로그인하면 로그아웃, 마이페이지 생기게)
// 여러개 내보낼 때는 export { }
