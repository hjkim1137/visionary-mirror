import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';

import Layout from './pages/Layout';

function App() {
  const location = useLocation();
  useEffect(() => {
    if (window.localStorage.getItem('isLogin') == 1) {
      console.log('로그인상태입니다');
    }
    console.log('nowpath', window.location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
