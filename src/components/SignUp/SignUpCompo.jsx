import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignUpCompo.module.scss';
import { useSignUpValidation } from './SignupValidation';

function SignUpCompo() {
  const [username, setUsername] = useState(''); // nickname
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  // 회원가입 유효성 검사 커스텀 훅 불러오기
  const { usernameError, emailError, passwordError, confirmPasswordError } =
    useSignUpValidation(username, email, password, confirmPassword);

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
      console.log('Form validation failed'); // 추가
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
            return null;
          });
        if (createUserResult && !createUserResult.err) {
          // 회원가입 성공 후 홈('/') 리다이렉트
          alert('회원가입에 성공하였습니다. 로그인 해주세요.');
          navigate('/login');
        } else {
          // 회원가입 실패
          console.log('createUserResult', createUserResult);
          alert('회원가입에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
        }
      }
    } catch (err) {
      console.log('err.message', err.message);
      alert('인증에 실패하였습니다. 새로고침 후 다시 시도해주세요.'); //firebase 오류 등(이미 존재하는 이메일 등)
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
    const disabled =
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !username ||
      !email ||
      !password ||
      !confirmPassword;
    return disabled;
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
              <div>
                <div className={styles.error}>{passwordError.line1}</div>
                <div className={styles.error}>{passwordError.line2}</div>
              </div>
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
          <div className={styles.registerBtnBox}>
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
