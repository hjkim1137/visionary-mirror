import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Accounts from './pages/Accounts';
import Home from './pages/Home';
import GetSampleBoard from './pages/GetSampleBoard';
import MakeBoardName from './pages/MakeBoardName';
import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';
import VisionBoardGrid from './pages/VisionBoardGrid';
import NAPage from './pages/NaPage';
import Layout from './pages/Layout';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('isLogin') == 1) {
      console.log('App mounted');
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkLogin = () => {
      if (localStorage.getItem('isLogin') == 1) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };

    // 초기 로그인 상태 설정
    checkLogin();

    // localStorage가 변경될 때마다 로그인 상태 재설정
    window.addEventListener('storage', checkLogin);

    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  return (
    <Layout isLogin={isLogin} setIsLogin={setIsLogin}>
      <Routes>
        <Route path="/" element={<Home />} />
        {!isLogin && (
          <>
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
          </>
        )}
        {isLogin && ( // 로그인 했을 때만 렌더링
          <>
            <Route path="/accountedit" element={<Accounts />} />
            <Route path="/getsampleboard" element={<GetSampleBoard />} />
            <Route path="/makeboardName" element={<MakeBoardName />} />
            <Route path="/myvisionboard/list" element={<MyVisionBoard />} />
            <Route
              path="/myvisionboardgrid/:id"
              element={<MyVisionBoardGrid />}
            />
            <Route path="/visionboardgrid" element={<VisionBoardGrid />} />
          </>
        )}
        {/* 유효하지 않는 경로 요청 시  */}
        <Route path="*" element={<NAPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
