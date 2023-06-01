import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';

function App() {
  const [isInit, setIsInit] = useState(false); // firebase 초기화 확인
  const [isLogin, setIsLogin] = useState(false); // 현재 유저로그인(O: true, X: false)

  useEffect(() => {
    // auth 상태가 변경(로그인 또는 로그아웃)되면 수행
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true); // 로그인 상태
      } else {
        setIsLogin(false); // 로그아웃 상태
      }

      setIsInit(true); // firebase 초기화 완료
    });
  }, []);

  return (
    <>
      {isInit ? (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={isLogin ? <Home /> : <Navigate replace to="/login" />}
            />
            <Route path="/login" element={<SignIn isLogin={isLogin} />} />
            <Route path="/register" element={<SignUp isLogin={isLogin} />} />
          </Routes>
        </BrowserRouter>
      ) : (
        'Loading...'
      )}
    </>
  );
}

export default App;
