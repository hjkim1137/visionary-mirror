import { useState, useEffect } from 'react';

export const useSignUpValidation = (
  username,
  email,
  password,
  confirmPassword
) => {
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        '비밀번호는 닉네임이나 이메일과 다르며, 6~16자 사이여야 합니다.'
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

  return { usernameError, emailError, passwordError, confirmPasswordError };
};
