import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignUpCompo.module.scss';

function SignUpCompo() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  // 이 주석 풀어도 /login으로 이동 안하면서 + 회원가입 창 안나옴
  // Firebase Auth는 사용자의 로그인 상태 변화 관찰하는 onAuthStateChanged 메서드를 제공
  //이를 이용, 사용자가 로그아웃 했을 때 페이지를 이동
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       navigate('/login');
  //     }
  //   });

  //   // Clean up
  //   return () => unsubscribe();
  // }, [navigate]);

  useEffect(() => {
    if (username.length < 3 || username.length > 12) {
      setUsernameError('닉네임은 3~12자 사이여야 합니다.');
    } else {
      setUsernameError('');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
    } else {
      setEmailError('');
    }

    if (
      password.length < 6 ||
      password.length > 16 ||
      password === username ||
      password === email
    ) {
      setPasswordError(
        <div className={styles.spanWrapper}>
          <span className={styles.span}>
            비밀번호는 닉네임이나 이메일과 다르며,
          </span>
          <span className={styles.span}>6~16자 사이여야 합니다.</span>
        </div>
      );
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  }, [username, email, password, confirmPassword]);

  /** 회원가입 기능 수행 */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      username.length < 3 ||
      username.length > 12 ||
      password.length < 6 ||
      password.length > 16 ||
      password !== confirmPassword
    ) {
      return;
    }

    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      if (data) {
        // const { user } = data;
        const username = 'username'; // nickname
        // const token = await user.getIdToken(); // Backend로 넘겨줘야될 토큰

        const {
          user: { uid },
        } = data;

        // 로그아웃. 그러나 Firebase에 로그아웃을 시키는 명령만을 보내고,
        // 실제로 어플리케이션의 라우팅을 변경하진 않음
        await auth.signOut();
        console.log('User signed out');

        console.log('uid', uid);
        console.log('username', username);

        // ********** [api/v1/accounts] api 완성되면 주석 제거. ********** //
        const createUserResult = await fetch(`/api/v1/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            username: username,
          }),
        });
        const resultJson = await createUserResult.json();
        // .then((res) => res.json())
        // .catch((err) => {
        //   console.log({ err });
        //   return null;
        // });

        // 회원가입 성패 여부
        if (resultJson && !resultJson.err) {
          alert('회원가입에 성공하였습니다.');
          navigate('/login');
        } else {
          alert('회원가입 실패');
        }
      }
    } catch (error) {
      console.log(error.message);
      alert('회원가입 실패, 새로고침 해주세요.');
    }
  };

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const isSignUpButtonDisabled = () => {
    return (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>회원가입</div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              name="username"
              type="text"
              placeholder="닉네임"
              value={username}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
            {usernameError && (
              <div className={styles.error}>{usernameError}</div>
            )}
          </div>
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
            {emailError && <div className={styles.error}>{emailError}</div>}
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
            {passwordError && (
              <div className={styles.error}>{passwordError}</div>
            )}
          </div>
          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
            {confirmPasswordError && (
              <div className={styles.error}>{confirmPasswordError}</div>
            )}
          </div>
          <div>
            <input
              type="submit"
              value="회원가입"
              disabled={isSignUpButtonDisabled()}
              className={styles.registerBtn}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUpCompo;
