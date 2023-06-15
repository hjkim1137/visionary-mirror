import Header from '../components/Header/Header';
import React from 'react';

function Layout({ children, isLogin, setIsLogin }) {
  return (
    <>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      {children}
    </>
  );
}

export default Layout;
