import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  getIdToken,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignInCompo.module.scss';

function SignInCompo({ isLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();
  useEffect(() => {
    isLogin && navigate('/');
  }, [isLogin, navigate]);

  // 내부 유효성 검사
  // 이메일 형식 체크 함수
  const isEmailValid = (loginEmail) => {
    return String(loginEmail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // 비밀번호 길이 체크 함수
  const isPasswordValid = (loginPassword) => {
    return loginPassword.length >= 4;
  };

  // 로그인 기능 수행
  const onSubmit = async (e) => {
    e.preventDefault();

    // 이메일과 비밀번호 입력 확인
    if (email === '' || password === '') {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 이메일 검사
    if (!isEmailValid(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 비밀번호 길이 검사
    if (!isPasswordValid(password)) {
      alert('비밀번호는 4글자 이상이어야 합니다.');
      return;
    }

    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      console.log(data); // data : {user: {accessToken: "tokentoken" } }
      if (data) {
        // const { user } = data;
        // const token = user.getIdToken(user.uid);

        const {
          user: { uid },
        } = data;
        const token = await getIdToken(auth.currentUser);
        console.log(uid);
        console.log('token', token);

        // api 완성되면 주석 제거 - 로그인 로직 시작(nest.js에 POST)
        try {
          const signinResult = await fetch(`/api/v1/accounts/signin`, {
            method: 'POST',
            body: JSON.stringify({ token }), // token: "string",
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((res) => res.json()); // cookie가 클라이언트에 탑재됨.
          // .catch((err) => {
          //   // POST 요청 실패 시
          //   console.log({ err });
          //   return null;
          // });

          /*
           * signinResult = {
           *   error: { statusCode: 201, ... }, // 에러 없으면(정상) err: null
           *   data: null
           * }
           *
           */

          if (signinResult && !signinResult.error) {
            console.log('signinResult:', signinResult);
            // 정상 로그인 완료(에러 없음)
            // App.js에서 로그인상태 파악을 위해 localstorage에 isLogin 설정
            localStorage.setItem('isLogin', '1'); // "1" = 로그인 / "0" = 로그아웃상태
            // navigate('/');
          } else {
            // 로그인 실패
            console.log('signinResult:', signinResult);
            localStorage.setItem('isLogin', '0');
            alert('로그인 실패');
          }
        } catch (err) {
          console.log(err);
          console.log('실패원인', err);
          return null;
        }
      }
      data && navigate('/'); // 로그인 완료 후 홈('/') 리다이렉트
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
      data && navigate('/'); // 가입 또는 로그인 완료 후 홈('/') 리다이렉트
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>로그인</div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              name="email"
              type="text"
              placeholder="이메일@test.com"
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
              placeholder="4글자 이상 입력해주세요."
              value={password}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>
            <input type="submit" value="로그인" className={styles.loginBtn} />
          </div>
        </form>

        <div className={styles.buttonBox}>
          <div>
            <Link to="/register">
              <button className={styles.registerBtn}>회원가입</button>
            </Link>
          </div>
          <div>
            <button
              name="google"
              onClick={onClick}
              className={styles.googleBtn}
            >
              구글 아이디로 시작
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInCompo;
