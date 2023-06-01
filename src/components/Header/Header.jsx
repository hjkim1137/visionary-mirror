// // 로그인 글자가 있던 자리에 로그아웃과 마이페이지가 보이게 하려고 하는 코드
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Logo from './Logo';
// import Hamburger from './Hamburger';
// import Nav from './Nav';
// import styles from '../components/Layout/Header/Header.module.scss';

// function Header() {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Nav 열림 조절
//   const handleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const navigateHome = () => {
//     navigate('/');
//   };

//   // 컴포넌트가 마운트 되거나 업데이트 될 때 마다 로그인 상태를 확인
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   });

//   const logout = () => {
//     // 로그아웃 시 토큰 제거
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.listWrapper}>
//         <ul>
//           <li>
//             <Hamburger clickHandler={handleMenu} />
//             <Nav isOpen={isOpen} />
//           </li>
//           <li onClick={navigateHome}>
//             <div className={styles.iconWrapper}>
//               <Logo />
//             </div>
//           </li>
//           <li>
//             {isLoggedIn ? (
//               <>
//                 <a onClick={logout}>로그아웃</a>
//                 <a onClick={() => navigate('/mypage')}>마이페이지</a>
//               </>
//             ) : (
//               <a onClick={() => navigate('/login')}>로그인</a>
//             )}
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }

// export default Header;

// 로고 등 여러 색과 세밀한 css는(호버 시 포인터 바뀜 등) 나중에
// 햄버거(네브는 옆에서 슬라이드), 로고(홈 이동), 로그인(로그인하면 로그아웃, 마이페이지 생기게)
// 여러개 내보낼 때는 export { }

////////////////////////////////////////////////////////////////////////////////
// 로그인 상태 확인 방법 중 하나: 로컬 스토리지에 저장된 토큰을 확인하여 로그인 상태를 판단하는 방법
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Logo from './Logo';
// import Hamburger from './Hamburger';
// import Nav from './Nav';
// import styles from '../components/Layout/Header/Header.module.scss';
//

// function Header() {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Nav 열림 조절
//   const handleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const navigateHome = () => {
//     navigate('/');
//   };

//   // 컴포넌트가 마운트 되거나 업데이트 될 때 마다 로그인 상태를 확인
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   });

//   const logout = () => {
//     // 로그아웃 시 토큰 제거
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.listWrapper}>
//         <ul>
//           <li>
//             <Hamburger clickHandler={handleMenu} />
//             <Nav isOpen={isOpen} />
//           </li>
//           <li onClick={navigateHome}>
//             <div className={styles.iconWrapper}>
//               <Logo />
//             </div>
//           </li>
//           <li>
//             {isLoggedIn ? (
//               <>
//                 <a onClick={logout}>로그아웃</a>
//                 <a onClick={() => navigate('/mypage')}>마이페이지</a>
//               </>
//             ) : (
//               <a onClick={() => navigate('/login')}>로그인</a>
//             )}
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }

// export default Header;

////////////////////////////////////////////////////////////////////////////////
// 실제로 로그인 해볼 수 있게 하는 코드: localStorage이용, 사용자가 '로그인' 버튼을 눌렀을 때 login 함수가 호출되고, '로그아웃' 버튼을 눌렀을 때 logout 함수가 호출

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Logo from './Logo';
// import Hamburger from './Hamburger';
// import Nav from './Nav';
// import styles from '../components/Layout/Header/Header.module.scss';

// function Header() {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // 로그인 상태를 체크하여 useState에 설정합니다.

//   // Nav 열림 조절
//   const handleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const navigateHome = () => {
//     navigate('/');
//   };

//   // 가상의 로그인 함수
//   const login = () => {
//     // 로그인이 성공했다고 가정하고, 임의의 토큰을 로컬 스토리지에 저장
//     localStorage.setItem('token', 'YOUR_TOKEN');
//     setIsLoggedIn(true); // 로그인 상태 true로 설정.
//   };

//   // 가상의 로그아웃 함수
//   const logout = () => {
//     // 로그아웃 시 토큰 제거
//     localStorage.removeItem('token');
//     setIsLoggedIn(false); // 로그인 상태 false로 설정
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.listWrapper}>
//         <ul>
//           <li>
//             <Hamburger clickHandler={handleMenu} />
//             <Nav isOpen={isOpen} />
//           </li>
//           <li onClick={navigateHome}>
//             <div className={styles.iconWrapper}>
//               <Logo />
//             </div>
//           </li>
//           <li>
//             {isLoggedIn ? (
//               <div>
//                 <button onClick={logout}>로그아웃</button>
//                 <a onClick={() => navigate('/mypage')}>마이페이지</a>
//               </div>
//             ) : (
//               <button onClick={login}>
//     <a onClick={() => navigate('/login')}>
//       로그인
//     </a>
//  </button>
//             )}
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }

// export default Header;

////////////////////////////////////////////////////////////////////////////////
// 실제로 로그인 해볼 수 있게 하는 코드2 :세션 쿠키를 사용, 쿠키가 클라이언트에 저장되어 세션 식별하는 데 사용.
// 사용자가 로그인하면 서버는 쿠키를 생성하고 HTTP 응답 헤더를 통해 클라이언트에 전송

// Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from './Logo';
import Hamburger from './Hamburger';
import Nav from './Nav';
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!document.cookie); // 로그인 상태를 체크하여 useState에 설정

  // Nav 열림 조절
  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateHome = () => {
    navigate('/');
  };

  // 가상의 로그인 함수
  const login = () => {
    // 로그인이 성공했다고 가정하고, 쿠키를 설정
    document.cookie = 'session=YOUR_SESSION_ID';
    setIsLoggedIn(true); // 로그인 상태 true로 설정
  };

  // 가상의 로그아웃 함수
  const logout = () => {
    // 로그아웃 시 쿠키 제거
    document.cookie =
      'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false); // 로그인 상태 false로 설정
  };

  return (
    <>
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
              {isLoggedIn ? (
                <div>
                  <button onClick={logout}>로그아웃</button>
                  <a onClick={() => navigate('/mypage')}>마이페이지</a>
                </div>
              ) : (
                <button onClick={login}>
                  <a onClick={() => navigate('/login')}>로그인</a>
                </button>
              )}
            </li>
          </ul>
        </div>
      </header>
      <div className={styles.test}>
        <h1 className={styles.test1}>1</h1>
      </div>
    </>
  );
}

export default Header;
