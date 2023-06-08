import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import GetSampleBoard from './pages/GetSampleBoard';
import MakeBoardName from './pages/MakeBoardName';
import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';
import VisionBoardGrid from './pages/VisionBoardGrid';
import Layout from './pages/Layout';

function App() {
  const [isInit, setIsInit] = useState(false); // firebase 초기화 확인
  const [isLogin, setIsLogin] = useState(false); // 현재 유저로그인(O: true, X: false)
  const navigate = useNavigate();

  useEffect(() => {
    // auth 상태가 변경(로그인 또는 로그아웃)되면 수행
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true); // 로그인 상태
      } else {
        setIsLogin(false); // 로그아웃 상태
        navigate('/login'); // 로그아웃 시 사용자를 로그인 페이지로 리다이렉트
      }

      setIsInit(true); // firebase 초기화 완료
    });
  }, [navigate]);

  return (
    <Layout>
      {isInit ? (
        <Routes>
          <Route
            path="*"
            element={isLogin ? <Home /> : <Navigate replace to="/login" />}
          />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          {isLogin && ( // 로그인 했을 때만 렌더링
            <>
              <Route path="/getsampleboard" element={<GetSampleBoard />} />
              <Route path="/makeboardName" element={<MakeBoardName />} />
              <Route path="/myvisionboard" element={<MyVisionBoard />} />
              <Route
                path="/myvisionboardgrid/:id"
                element={<MyVisionBoardGrid />}
              />
              <Route path="/visionboardgrid" element={<VisionBoardGrid />} />
            </>
          )}
        </Routes>
      ) : (
        'Loading...'
      )}
    </Layout>
  );
}

export default App;
