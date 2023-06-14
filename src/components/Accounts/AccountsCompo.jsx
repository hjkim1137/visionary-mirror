import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccountsCompo.module.scss';

function AccountsCompo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

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
        console.log('회원정보 요청 실패', error.message);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해 보세요.');
        window.location.reload();
      }
    }

    fetchUser();
  }, []);

  // 입력 상태 변경
  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  // 회원 정보 수정 취소 기능
  const handleReset = () => {
    if (user) {
      setEditedUser({
        ...user,
        password: '',
        passwordConfirm: '',
      });
    }
  };

  // 회원정보 수정 기능
  const handleUpdate = async () => {
    if (window.confirm('회원 정보를 수정하시겠습니까?')) {
      try {
        const response = await fetch('/api/v1/accounts', {
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

        if (!response.ok) {
          throw new Error('Failed to update user.');
        }
        alert('회원 정보 수정이 완료 되었습니다.');
        setUser(editedUser);
        console.log('editedUser', editedUser);
      } catch (error) {
        console.error('회원 정보 수정에 실패하였습니다', error);
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
          throw new Error('Failed to delete user.');
        }

        alert('회원 탈퇴가 완료되었습니다.');
        setEditedUser({ ...editedUser, password: '', passwordConfirm: '' });
        navigate('/');
        window.location.reload();
        localStorage.setItem('isLogin', 0); // ui 변경을 위해 상태 수동으로 제거
      } catch (error) {
        console.error('회원 탈퇴 요청이 실패하였습니다', error);
      }
    }
  };

  return (
    <div>
      <div>
        {/* 닉네임 칸 */}
        <input
          type="text"
          name="username"
          value={editedUser.username}
          onChange={handleChange}
          className={styles.mypageInput}
          placeholder="닉네임"
        />
      </div>
      <div>
        {/* 이메일 칸 */}
        <input
          type="text"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
          className={styles.mypageInput}
          placeholder="이메일"
        />
      </div>
      <div>
        {/* 비밀번호 칸 */}
        <input
          type="password"
          name="password"
          value={editedUser.password}
          onChange={handleChange}
          className={styles.mypageInput}
          placeholder="비밀번호"
        />
      </div>
      <div>
        {/* 비밀번호 확인 칸 */}
        <input
          type="password"
          name="passwordConfirm"
          value={editedUser.passwordConfirm}
          onChange={handleChange} // 사용자가 입력한 값을 상태에 저장
          className={styles.mypageInput}
          placeholder="비밀번호 확인"
        />
      </div>
      <div className={styles.buttonBox}>
        <button onClick={handleUpdate}>수정완료하기</button>
        <button onClick={handleReset}>수정취소하기</button>
        <button onClick={handleDelete}>탈퇴하기</button>
      </div>
    </div>
  );
}

export default AccountsCompo;
