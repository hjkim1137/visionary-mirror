import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import styles from './SignUpCompo.module.scss';

function SignUpCompo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();

  /** 회원가입 기능 수행 */
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      if (data) {
        const { user } = data;
        const username = 'username'; // nickname
        const token = await user.getIdToken(); // Backend로 넘겨줘야될 토큰

        // *********************************************************** //
        // ********** [api/v1/accounts] api 완성되면 주석 제거. ********** //
        // *********************************************************** //

        // const createUserResult = await fetch(`/api/api/v1/accounts`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     token,
        //     username,
        //   }),
        // })
        //   .then((res) => res.json())
        //   .catch((err) => {
        //     console.log({ err });
        //     return null;
        //   });

        // if (createUserResult && !createUserResult.err) {
        //   // 회원가입 성공
        //   navigate('/');
        // } else {
        //   // 회원가입 실패
        //   alert('회원가입 실패');
        // }
      }
    } catch (error) {
      console.log(error.message);
      alert('회원가입에 실패하였습니다. 새로고침 해주세요.');
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
              name="username"
              type="text"
              placeholder="닉네임"
              // value={username}
              onChange={onChange}
              // required
            />
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
