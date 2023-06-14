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
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
            console.log('signinResult:', signinResult); // {isLogin:true}
            // 정상 로그인 완료(= 에러 없음 err:null)
            // App.js에서 로그인상태 파악을 위해 localstorage에 isLogin 설정
            localStorage.setItem('isLogin', '1'); // "1" = 로그인 / "0" = 로그아웃상태
            alert('로그인에 성공하였습니다.');
            navigate('/');
          } else {
            // 로그인 실패
            console.log('signinResult:', signinResult); // {isLogin:false}
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

      console.log('displayName:', displayName); // 구글 계정 이름
      console.log('uid', uid);

      try {
        // 회원가입 api 통신 시작
        const createUserResult = await fetch(`/api/v1/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, username: displayName }),
        }).then((res) => res.json());

        if (createUserResult && !createUserResult.err) {
          console.log('회원가입 요청 결과:', createUserResult); // error: null 이면 성공
          alert(
            'Google 계정으로 회원가입에 성공하였습니다. 자동 로그인을 시도합니다.'
          );
        } else {
          // 회원가입 실패
          console.log('회원가입 요청 결과:', createUserResult);
          alert(
            'Google 계정으로 회원가입에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
          );
        }
      } catch (err) {
        console.log('회원가입 요청 결과:', err.message);
        alert(
          '회원가입을 위한 서버와 통신이 실패했습니다. 새로고침 후 다시 시도해주세요.'
        );
        return null;
      }

      // 로그인 api 통신 시작
      // 토큰 받아오기
      const token = await getIdToken(auth.currentUser);
      console.log('token', token);

      try {
        const signinResult = await fetch(`/api/v1/accounts/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }).then((res) => res.json());

        // 로그인 요청 결과
        if (signinResult && !signinResult.error) {
          console.log('로그인 요청결과:', signinResult); // {isLogin:true} 이면 성공

          localStorage.setItem('isLogin', '1');
          alert('Google 계정으로 로그인에 성공하였습니다.');
          navigate('/');
        } else {
          // 로그인 실패
          console.log('signinResult:', signinResult); // {isLogin:false}
          localStorage.setItem('isLogin', '0');
          alert(
            'Google 계정으로 로그인에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
          );
          await auth.signOut(); // 로그인 실패 시 Firebase 로그아웃
        }
      } catch (error) {
        console.log('error.message', error.message);
        alert(
          '로그인을 위한 서버와 통신이 실패하였습니다. 새로고침 후 재 시도 해주세요.'
        );
        await auth.signOut(); // 통신 실패 시 Firebase 로그아웃
      }
    } catch (error) {
      console.log('인증 오류:', error.message);
      alert('구글 계정 인증에 실패하였습니다. 새로고침 후 재 시도 해주세요.');
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
              Google 계정으로 간편 시작
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInCompo;
