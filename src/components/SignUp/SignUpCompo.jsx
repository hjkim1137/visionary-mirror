import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignUpCompo.module.scss';

function SignUpCompo() {
  const [username, setUsername] = useState(''); // nickname
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

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
        // 사용자 등록 성공 시 data 객체 반환
        // const { user } = data;
        // const token = await user.getIdToken(); // Backend로 넘겨줘야될 토큰

        const {
          user: { uid },
        } = data;

        auth.signOut(); //firebase 로그아웃

        console.log('uid', uid);
        console.log('username', username);

        const createUserResult = await fetch(`/api/v1/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            username: username,
          }),
        })
          .then((res) => res.json()) // 서버에서 응답 없거나 json 아닌 다른 형태 응답일 경우 unexpected end of JSON imput 같은 오류 발생 가능함
          .catch((err) => {
            // console.log({ err });
            console.log('통신 에러', err.message);
            alert(
              '서버와 통신에 실패하였습니다. 새로고침 후 다시 시도해주세요.'
            );
            navigate('/register');
            return null;
          });
        if (createUserResult && !createUserResult.err) {
          // 회원가입 성공 후 홈('/') 리다이렉트
          alert('회원가입에 성공하였습니다.');
          navigate('/');
        } else {
          // 회원가입 실패
          console.log('createUserResult', createUserResult);
          alert('회원가입에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
          navigate('/register');
        }
      }
    } catch (err) {
      console.log('err.message', err.message);
      alert('인증에 실패하였습니다. 새로고침 후 다시 시도해주세요.'); //firebase 오류 등(이미 존재하는 이메일 등)
      navigate('/register');
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
