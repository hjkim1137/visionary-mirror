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

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();

  // 로그인 내부 유효성 검사
  useEffect(() => {
    isLogin && navigate('/');

    // 이메일 형식 체크 함수
    const isEmailValid = (loginEmail) => {
      return String(loginEmail)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/
        );
    };

    // 이메일 검사
    if (!isEmailValid(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }

    // 비밀번호 길이 체크 함수
    const isPasswordValid = (loginPassword) => {
      return loginPassword.length >= 6;
    };

    // 비밀번호 길이 검사
    if (!isPasswordValid(password)) {
      setPasswordError('비밀번호는 6글자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  }, [isLogin, email, password, navigate]);

  // 로그인 기능 수행
  const onSubmit = async (e) => {
    e.preventDefault();

    // 이메일과 비밀번호 입력 확인
    if (email === '' || password === '') {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 로그인 firebase 시작
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

        // 로그인 api 통신 시작
        try {
          const signinResult = await fetch(`/api/v1/accounts/signin`, {
            method: 'POST',
            body: JSON.stringify({ token }), // token: "string",
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((res) => res.json()); // cookie가 클라이언트에 탑재됨.

          if (signinResult && !signinResult.error) {
            console.log('signinResult:', signinResult);
            // 정상 로그인 완료(에러 없음)
            // App.js에서 로그인상태 파악을 위해 localstorage에 isLogin 설정
            localStorage.setItem('isLogin', '1'); // "1" = 로그인 / "0" = 로그아웃상태
            alert('로그인에 성공하였습니다.');
            navigate('/');
          } else {
            // 로그인 실패
            console.log('signinResult:', signinResult);
            localStorage.setItem('isLogin', '0');
            alert('로그인에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
          }
        } catch (err) {
          console.log('통신 에러', err.message);
          alert('서버와 통신에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
          return null;
        }
      }
      data && navigate('/'); // 로그인 완료 후 홈('/') 리다이렉트
    } catch (err) {
      // firebase 오류 등
      console.log('인증 에러', err.message);
      alert('인증에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
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
  /** 구글 계정으로 가입 및 로그인 */
  const googleOnClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    }

    try {
      const data = await signInWithPopup(auth, provider);
      console.log(data);
      const {
        user: { uid, displayName },
      } = data;
      console.log('displayName:', displayName);
      console.log('uid', uid);

      // 회원가입
      const createUserResult = await fetch(`/api/v1/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, username: displayName }),
      });

      const resultJson = await createUserResult.json();
      console.log('resultJson:', resultJson);

      // 회원가입 성공 후 토큰 받아오기
      const token = await getIdToken(auth.currentUser);
      console.log('token', token);

      // 로그인 시도
      const signinResult = await fetch(`/api/v1/accounts/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).then((res) => res.json());

      console.log('signinResult:', signinResult);

      // 한 번 만들면 세션 저장돼서 이후에는 바로 로그인 됨
      if (signinResult && !signinResult.error) {
        localStorage.setItem('isLogin', '1');
        alert('Google 계정으로 접속에 성공하였습니다.');
        data && navigate('/');
      } else {
        console.log('signinResult:', signinResult);
        localStorage.setItem('isLogin', '0');
        alert(
          'Google 계정으로 접속에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.log('error.message', error.message);
      alert('서버와 통신에 실패하였습니다. 새로고침 후 재 시도 해주세요.');
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
              placeholder="email@test.com"
              value={email}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="6글자 이상 입력해주세요."
              value={password}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
            {passwordError && (
              <div className={styles.error}>{passwordError}</div>
            )}
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
              onClick={googleOnClick}
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
