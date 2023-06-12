// 로그아웃 훅

import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

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
        navigate('/login');
      }
    } catch (error) {
      console.error('logout 실패:', error);
    }
  };

  return logout;
};
