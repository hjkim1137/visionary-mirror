import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Accounts from './pages/Accounts';
import Home from './pages/Home';
import GetSampleBoard from './pages/GetSampleBoard';
import MakeBoardName from './pages/MakeBoardName';
import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';
import VisionBoardGrid from './pages/VisionBoardGrid';
import Layout from './pages/Layout';

function App() {
  const [isLogin, setIsLogin] = useState(false); // 현재 유저로그인(O: true, X: false)
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    console.log('App Mounted');
    if (localStorage.getItem('isLogin') == 1) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location.pathname]);

  // 코치님이 작성 도와주신 파트 시작
  return (
    <Layout>
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
        <Route path="*" element={<div>404 not found</div>} />
        {/* home으로 돌아가게 링크  */}
      </Routes>
    </Layout>
  );
}
export default App;
