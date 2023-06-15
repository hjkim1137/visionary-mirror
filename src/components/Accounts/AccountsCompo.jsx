import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountsCompo.module.scss';
import { useAccountValidation } from './AccountsValidation';

function AccountsCompo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 회원정보수정(마이페이지) 유효성 검사 커스텀 훅 불러오기
  const { usernameError, emailError, passwordError, confirmPasswordError } =
    useAccountValidation(
      editedUser.username,
      editedUser.email,
      editedUser.password,
      editedUser.confirmPassword
    );

  // 로그인한 유저 정보 불러오기
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/v1/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('서버로부터 응답이 없습니다.');
        }

        const data = await response.json();

        if (response.status === 200) {
          const { username, email } = data.data;
          console.log({ username, email });
          setEditedUser({
            ...editedUser,
            username: username,
            email: email,
          });
          setUser(data.data);
        } else if (response.status === 401) {
          alert('인증되지 않은 사용자입니다. 다시 로그인을 해주세요.');
          localStorage.removeItem('isLogin');
          navigate('/login');
          throw new Error('인증되지 않은 사용자입니다.');
        } else if (response.status === 500) {
          alert('서버 오류가 발생했습니다.');
          throw new Error('서버 오류가 발생했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          throw new Error('알 수 없는 오류가 발생했습니다.');
        }
      } catch (error) {
        console.log('회원정보 요청 실패', error, error.message);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해 보세요.');
      }
    }

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  // 회원정보 수정 기능
  const handleUpdate = async (e) => {
    e.preventDefault();

    // 회원정보 수정할 때 회원가입 형식이랑(3자~10자) 맞아야 수정됨 아니면 400번 에러 뜸.
    // 갱신한 정보로 로그인 되는 것 확인 완료

    if (window.confirm('회원 정보를 수정하시겠습니까?')) {
      try {
        const response = await fetch(`/api/v1/accounts`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: editedUser.username,
            email: editedUser.email,
            password: editedUser.password,
          }),
        });

        console.log('회원정보 수정 요청 응답:', response);

        if (!response.ok) {
          throw new Error('회원정보 수정에 실패하였습니다.');
        }

        // const data = await response.json(); // 응답을 JSON으로 파싱

        if (response.status === 200) {
          alert('회원 정보 수정이 완료 되었습니다.');
          setUser(editedUser);
          console.log('editedUser', editedUser);
        } else if (response.status === 400) {
          alert('잘못된 요청입니다.');
          throw new Error('잘못된 요청입니다');
        } else if (response.status === 401) {
          alert('인증되지 않은 사용자입니다.다시 로그인을 해주세요');
          localStorage.removeItem('isLogin');
          navigate('/login');
          throw new Error('인증되지 않은 사용자입니다.');
        } else if (response.status === 500) {
          alert('서버 오류가 발생했습니다.');
          throw new Error('서버 오류가 발생했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          throw new Error('알 수 없는 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('서버와 통신에 실패하였습니다', error.message);
        alert('회원정보 수정 요청에 실패하였습니다.다시 한번 해보세요.');
        window.location.reload();
      }
    }
  };

  // 회원 탈퇴 기능
  const handleDelete = async () => {
    if (window.confirm('회원 탈퇴 하시겠습니까?')) {
      try {
        const response = await fetch('/api/v1/accounts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('회원 탈퇴에 실패하였습니다.');
        }

        if (response.status === 200) {
          alert('회원 탈퇴가 완료되었습니다.');
          setEditedUser({ ...editedUser, password: '', confirmPassword: '' });
          navigate('/');
          window.location.reload();
          localStorage.setItem('isLogin', 0); // ui 변경을 위해 상태 수동으로 제거
        } else if (response.status === 400) {
          alert('잘못된 요청입니다.');
          throw new Error('잘못된 요청입니다.');
        } else if (response.status === 401) {
          alert('인증되지 않은 사용자입니다.다시 로그인을 해주세요');
          localStorage.removeItem('isLogin');
          navigate('/login');
          throw new Error('인증되지 않은 사용자입니다.');
        } else if (response.status === 500) {
          alert('서버 오류가 발생했습니다.');
          throw new Error('서버 오류가 발생했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          throw new Error('알 수 없는 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('회원 탈퇴 요청이 실패하였습니다', error);
        alert('회원에서 탈퇴하는데 실패했습니다.다시 시도해보세요');
        window.location.reload();
      }
    }
  };

  const isSignUpButtonDisabled = () => {
    const disabled =
      usernameError || emailError || passwordError || confirmPasswordError;
    return disabled;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>마이페이지</div>
        <form onSubmit={handleUpdate}>
          <div className={styles.input}>
            {/* 닉네임 칸*/}
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleChange}
              className={styles.mypageInput}
              placeholder="닉네임"
              autoComplete="username"
            />
            {usernameError && (
              <div className={styles.error}>{usernameError}</div>
            )}
          </div>
          <div className={styles.input}>
            {/* 이메일 칸 */}
            <input
              type="text"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className={styles.mypageInput}
              placeholder="이메일"
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
          <div className={styles.input2}>
            {/* 비밀번호 칸 */}
            <input
              type="password"
              name="password"
              value={editedUser.password}
              onChange={handleChange}
              className={styles.mypageInput}
              placeholder="비밀번호"
              autoComplete="new-password" // 자동완성 비활성화
            />
            {passwordError && (
              <div>
                <div className={styles.error}>{passwordError.line1}</div>
                <div className={styles.error}>{passwordError.line2}</div>
              </div>
            )}
          </div>
          <div className={styles.input}>
            {/* 비밀번호 확인 칸 */}
            <input
              type="password"
              name="confirmPassword"
              value={editedUser.confirmPassword}
              onChange={handleChange}
              className={styles.mypageInput}
              placeholder="비밀번호 확인"
            />
            {confirmPasswordError && (
              <div className={styles.error}>{confirmPasswordError}</div>
            )}
          </div>

          <div className={styles.buttonBoxWrapper}>
            <div className={styles.buttonBox}>
              <button
                type="submit"
                className={styles.correctBtn}
                disabled={isSignUpButtonDisabled()}
              >
                수정 완료하기
              </button>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className={styles.secessionBtn}
            >
              탈퇴하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountsCompo;
