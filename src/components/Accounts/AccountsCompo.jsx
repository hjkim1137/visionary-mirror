// 할 일 : 페치,기능 하나씩 추가하자.
// 유효성 -> +get -> +put,수정 -> +취소하기 -> +탈퇴하기 -> api테스트(가 잘 안됨) -> 에러 더 고쳐

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';

import styles from './AccountsCompo.module.scss';

function AccountsCompo({ isLogin }) {
  const [formState, setFormState] = useState({
    username: { value: '', valid: false, message: '', touched: false },
    email: { value: '', valid: false, message: '', touched: false },
    password: { value: '', valid: false, message: '', touched: false },
    passwordConfirm: { value: '', valid: false, message: '', touched: false },
  });

  // 사용자 원래 정보 저장
  const [originalState, setOriginalState] = useState(null);

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  // GET: (input 입력 전)회원정보 받기 요청
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('/api/v1/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        // 응답 없을 때
        if (!response.ok) {
          console.log('Error getting account information');
          return;
        }

        // 응답을 json으로 파싱
        const data = await response.json();

        if (response.status === 200 && data && data.data) {
          const { username, email } = data.data;
          const newState = {
            username: { value: username, valid: true, touched: true },
            email: { value: email, valid: true, touched: true },
          };

          // 사용자 정보 변경
          setFormState(newState);
          setOriginalState(newState);
        } else {
          console.error(`Error: ${data.error.message}`);
        }
      } catch (error) {
        console.log('회원정보 가져오기 요청 실패', error);
      }
    };

    fetchAccountInfo();
  }, []);

  // 입력 시 값 갱신, 유효성 검사
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    // newState를 formState의 이전 상태를 기반으로 정의
    setFormState((prevState) => {
      const newState = {
        ...prevState[name],
        value: value,
        touched: true,
        edited: true,
      };

      // 닉네임이 3~12자인지 확인 (가입버튼 누르기 전)
      if (name === 'username') {
        if (value.length < 3 || value.length > 12) {
          newState.message = '닉네임은 최소 3자 이상 12자 이하이어야 합니다.';
          newState.valid = false;
        } else {
          newState.message = '유효한 닉네임입니다.';
          newState.valid = true;
        }
      }

      // 메일 유효성 검사
      if (name === 'email') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          newState.message = '유효한 이메일을 입력해주세요.';
          newState.valid = false;
        } else {
          newState.message = '유효한 이메일입니다.';
          newState.valid = true;
        }
      }

      // 비밀번호에 닉네임이나 이메일 주소가 포함되어 있는지, 6~16자 이내인지 확인 (가입버튼 누르기 전)
      if (name === 'password') {
        const containsNumber = /\d/.test(value);
        const containsCharacter = /[a-zA-Z]/.test(value);
        const containsSpecialCharacter = /\W/.test(value);
        const countValidations = [
          containsNumber,
          containsCharacter,
          containsSpecialCharacter,
        ].filter(Boolean).length;

        if (
          value.includes(formState.username.value) ||
          value.includes(formState.email.value) ||
          value.length < 6 ||
          value.length > 16 ||
          countValidations < 2
        ) {
          newState.message =
            '비밀번호는 6자 이상 16자 이하이어야 하며, 닉네임과 이메일을 포함할 수 없습니다. 또한, 숫자, 문자, 특수 문자 중 적어도 두 가지를 포함해야 합니다.';
          newState.valid = false;
        } else {
          newState.message = '유효한 비밀번호입니다.';
          newState.valid = true;
        }
      }

      // 비밀번호 확인
      if (name === 'passwordConfirm') {
        if (value !== formState.password.value) {
          newState.message = '비밀번호가 일치하지 않습니다.';
          newState.valid = false;
        } else {
          newState.message = '비밀번호가 일치합니다.';
          newState.valid = true;
        }
      }

      return { ...prevState, [name]: newState };
    });
  };

  ////////////////////////////
  ///// 버튼들: 정보 수정, 취소, 탈퇴
  ////////////////////////////

  // PUT: 회원정보 수정 요청
  const onSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = Object.values(formState).every((field) => field.valid);
    if (!isFormValid) {
      return;
    }

    // 유저 확인
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.log('현재 로그인 중인 유저가 없습니다.');
      return;
    }

    try {
      const response = await fetch('/api/v1/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formState.username.value,
          email: formState.email.value,
          password: formState.password.value,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 200) {
        // 비밀번호 변경되었으면 로그아웃 처리
        if (formState.password.value !== '') {
          console.log('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          console.log('회원정보가 수정되었습니다.');
        }
      } else {
        console.error(`Error: ${data.error.message}`);
      }
    } catch (error) {
      console.log('회원정보 수정 요청 실패', error);
    }
  };

  // 회원정보 수정 취소
  const CancelAccountChange = () => {
    if (originalState) {
      setFormState(originalState);
      console.log('수정 취소');
    }
  };

  // DELETE: 탈퇴(회원정보 삭제) 요청
  const DeleteAccount = async (e) => {
    e.preventDefault();
    console.log('삭제 눌림');
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log('auth :', auth);
      console.log('user :', user);
      deleteUser(user)
        .then(async () => {
          try {
            const response = await fetch('/api/v1/accounts', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            const data = await response.json();

            if (response.status === 200) {
              console.log('회원정보가 삭제되었습니다.');
              navigate('/'); // 탈퇴시 홈으로 간다
            } else {
              console.error(`Error: ${data.error.message}`);
            }
          } catch (error) {
            console.log('delete요청 실패', error);
          }
        })
        .catch((error) => {
          console.log('파이어베이스 user 삭제 실패', error);
        });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>마이페이지</div>

        <form onSubmit={onSubmit}>
          <div>
            <input
              name="username"
              type="text"
              placeholder="닉네임"
              value={formState.username.value}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>{formState.username.touched && formState.username.message}</div>

          <div>
            <input
              name="email"
              type="text"
              placeholder="이메일"
              value={formState.email.value}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>{formState.email.touched && formState.email.message}</div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={formState.password.value}
              onChange={onChange}
              required
              className={styles.inputBox}
            />

            <div>
              {formState.password.touched && formState.password.message}
            </div>
          </div>

          <div>
            <input
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              className={styles.inputBox}
              value={formState.passwordConfirm.value}
              onChange={onChange}
              required
            />
          </div>
          <div>
            {formState.passwordConfirm.touched &&
              formState.passwordConfirm.message}
          </div>

          <div>
            <input
              type="submit"
              value="수정 완료하기"
              onClick={onSubmit}
              className={styles.registerBtn}
              disabled={!Object.values(formState).every((field) => field.valid)}
            />
          </div>

          <div>
            <input
              type="submit"
              value="수정 취소하기"
              onClick={CancelAccountChange}
              className={styles.registerBtn}
              disabled={
                !formState.username.valid ||
                !formState.email.valid ||
                !formState.password.valid ||
                !formState.passwordConfirm.valid
              }
            />
          </div>

          <div>
            <input
              type="submit"
              value="탈퇴하기"
              onClick={DeleteAccount}
              className={styles.registerBtn}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountsCompo;
