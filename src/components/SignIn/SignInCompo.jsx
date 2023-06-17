import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  getIdToken,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignInCompo.module.scss';
import useSigninValidation from './SinginValidation';

function SignInCompo({ isLogin }) {
  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();

  // 로그인 상태에 따라 홈 페이지로 이동
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  // 로그인 내부 유효성 검사 커스텀 훅 불러오기
  const { email, setEmail, password, setPassword, emailError, passwordError } =
    useSigninValidation('', '');

  // 비밀번호 찾기 버튼 아래 인풋을 보여줄지 말지 결정하는 상태
  const [showReset, setShowReset] = useState(false);

  // 비밀번호 찾기 이메일 입력 상태
  const [resetEmail, setResetEmail] = useState('');

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
      // console.log('data:', data); // data : {user: {accessToken: "tokentoken" } }
      if (data) {
        // const { user } = data;
        // const token = user.getIdToken(user.uid);

        const {
          user: { uid },
        } = data;
        const token = await getIdToken(auth.currentUser);
        // console.log('uid', uid);
        // console.log('token', token);

        await auth.signOut(); // authSignOut
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
            // console.log('signinResult:', signinResult); // {isLogin:true}
            // 정상 로그인 완료(= 에러 없음 err:null)
            // App.js에서 로그인상태 파악을 위해 localstorage에 isLogin 설정
            localStorage.setItem('isLogin', '1'); // "1" = 로그인 / "0" = 로그아웃상태
            alert('로그인에 성공하였습니다.');

            navigate('/');
          } else {
            // 로그인 실패
            // console.log('signinResult:', signinResult); // {isLogin:false}
            localStorage.setItem('isLogin', '0');
            alert('로그인에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
          }
        } catch (err) {
          // console.log('통신 에러', err.message);
          alert('서버와 통신에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
          return null;
        }
      }
    } catch (err) {
      // firebase 오류 등
      // console.log('인증 에러', err.message);
      alert('인증에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
    }
  };

  // 상태 업데이트
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'resetEmail') {
      // 비밀번호 재설정 이메일 상태 업데이트
      setResetEmail(value);
    }
  };

  // 비밀번호 재설정 이메일 전송
  const onResetPassword = async (e) => {
    e.preventDefault();
    const userConfirmed = window.confirm(
      '비밀번호 재설정 이메일을 전송하시겠습니까?'
    );
    if (userConfirmed) {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        alert(
          '비밀번호 재설정 이메일이 성공적으로 전송되었습니다. 메일함을 확인해주세요.'
        );
      } catch (err) {
        alert(`비밀번호 재설정 이메일 전송 실패: ${err.message}`);
      }
    }
  };

  /** 구글 계정으로 가입 및 로그인 시작 */
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
      // console.log('data', data); // UserCredentialImpl {user: UserImpl, ProviderId:'google.com', _tokenResponse: 계정 정보}
      // console.log('providerId', data.providerId); // "google.com"
      const {
        user: { uid, displayName },
      } = data;

      // console.log('displayName:', displayName); // 구글 계정 이름
      // console.log('uid', uid);

      try {
        // 회원가입 api 통신 시작
        const createUserResult = await fetch(`/api/v1/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, username: displayName }),
        }).then((res) => res.json());

        if (createUserResult && !createUserResult.err) {
          // console.log('회원가입 요청 결과:', createUserResult); // error: null 이면 성공
          alert(
            'Google 계정으로 회원가입에 성공하였습니다. 자동 로그인을 시도합니다.'
          );
        } else {
          // 회원가입 실패
          // console.log('회원가입 요청 결과:', createUserResult);
          alert(
            'Google 계정으로 회원가입에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
          );
        }
      } catch (err) {
        // console.log('회원가입 요청 결과:', err.message);
        alert(
          '회원가입을 위한 서버와 통신이 실패했습니다. 새로고침 후 다시 시도해주세요.'
        );
        return null;
      }

      // 로그인 api 통신 시작
      // 토큰 받아오기
      let token;
      if (auth.currentUser) {
        token = await getIdToken(auth.currentUser); // auth.currentUser 받으려면 이때까지 auth 로그인 되어 있어야 함.
        // console.log('token', token);
      } else {
        // console.log('현재 구글 계정으로 가입한 계정이 없습니다.');
        return;
      }

      try {
        const signinResult = await fetch(`/api/v1/accounts/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }).then((res) => res.json());

        // 로그인 요청 결과
        if (signinResult && !signinResult.error) {
          // console.log('로그인 요청결과:', signinResult); // {isLogin:true} 이면 성공

          localStorage.setItem('isLogin', '1');

          // displayName이 있으면 Google 계정으로 가입한 것이므로 세션 스토리지에 추가
          if (displayName) {
            sessionStorage.setItem('googleUser', '1');
          }

          alert('Google 계정으로 로그인에 성공하였습니다.');
          await auth.signOut();
          navigate('/');
        } else {
          // 로그인 실패
          // console.log('signinResult:', signinResult); // {isLogin:false}
          localStorage.setItem('isLogin', '0');
          alert(
            'Google 계정으로 로그인에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
          );
        }
      } catch (error) {
        // console.log('error.message', error.message);
        alert(
          '로그인을 위한 서버와 통신이 실패하였습니다. 새로고침 후 재 시도 해주세요.'
        );
        await auth.signOut(); // 통신 실패 시 Firebase 로그아웃
      }
    } catch (error) {
      // console.log('인증 오류:', error.message);
      alert('구글 계정 인증에 실패하였습니다. 새로고침 후 재 시도 해주세요.');
    }
  };
  /** 구글 계정으로 가입 및 로그인 끝*/

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
          <div className={styles.loginBtnBox}>
            <input type="submit" value="로그인" className={styles.loginBtn} />
          </div>
        </form>

        <div className={styles.buttonBox}>
          {/* 비밀번호 찾기 시작 */}
          <button
            onClick={() => setShowReset(!showReset)}
            className={styles.resetPasswordBtn}
          >
            비밀번호 찾기
          </button>
          {showReset && (
            <div className={styles.resetPWtitle}>
              <div>가입한 이메일 주소를 입력하세요.</div>
              <form onSubmit={onResetPassword}>
                <div className={styles.resetBox}>
                  <input
                    name="resetEmail"
                    type="text"
                    placeholder="email@test.com"
                    value={resetEmail}
                    onChange={onChange}
                    required
                    className={styles.resetPWinput}
                  />
                  <input
                    type="submit"
                    value="전송"
                    className={styles.resetPWBtn}
                  />
                </div>
              </form>
            </div>
          )}
          {/* 비밀번호 찾기 끝 */}
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
