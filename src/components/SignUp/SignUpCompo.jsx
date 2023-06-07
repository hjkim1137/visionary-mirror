import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignUpCompo.module.scss';

function SignUpCompo({ isLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();
  useEffect(() => {
    isLogin && navigate('/');
  }, [isLogin, navigate]);

  /** 회원가입 기능 수행 */
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      data && navigate('/'); // 가입 완료 후 홈('/') 리다이렉트
    } catch (error) {
      console.log(error.message);
    }
  };
  /** 필드 입력시 해당 값 갱신 */
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>회원가입</div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              name="email"
              type="text"
              placeholder="이메일"
              value={email}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>
            <input
              type="submit"
              value="회원가입"
              className={styles.registerBtn}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUpCompo;
