import { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /** 회원가입 기능 수행 */
  const onSubmit = (e) => {
    e.preventDefault();
  };
  /** 필드 입력시 해당 값 갱신 */
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
  };

  return (
    <>
      <div>회원가입</div>
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
          <input type="submit" value="회원가입" />
        </div>
      </form>
    </>
  );
}

export default SignUp;
