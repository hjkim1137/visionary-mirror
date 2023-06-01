import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

function SignIn({ isLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();
  useEffect(() => {
    isLogin && navigate('/');
  }, [isLogin, navigate]);

  /** 로그인 기능 수행 */
  const onSubmit = async (e) => {
    e.preventDefault();
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
  /** 다른 계정으로 가입 및 로그인 */
  const onClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    }

    try {
      const data = await signInWithPopup(auth, provider);
      data && navigate('/'); // 가입 완료 후 홈('/') 리다이렉트
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div>로그인</div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="email"
            type="text"
            placeholder="이메일"
            value={email}
            onChange={onChange}
            required
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
          />
        </div>
        <div>
          <input type="submit" value="로그인" />
        </div>
      </form>
      <div>
        <Link to="/register">
          <button>회원가입</button>
        </Link>
      </div>
      <div>
        <button name="google" onClick={onClick}>
          구글 아이디로 시작
        </button>
      </div>
    </>
  );
}

export default SignIn;
