import { useNavigate } from 'react-router-dom';
import styles from './NAPageCompo.module.scss';

function NAPageCompo() {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className={styles.container}>
        <div>404 NOT FOUND</div>
        <div>페이지를 찾을 수 없습니다.</div>
        <div className={styles.buttonBox}>
          <button onClick={handleGoToHome} className={styles.mainBtn}>
            메인으로 돌아가기
          </button>
          <button onClick={handleGoToLogin} className={styles.loginBtn}>
            로그인하기
          </button>
        </div>
      </div>
    </>
  );
}

export default NAPageCompo;
