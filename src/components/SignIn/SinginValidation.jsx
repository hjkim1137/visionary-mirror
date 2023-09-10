import { useState, useEffect } from 'react';

const useSigninValidation = (initialEmail, initialPassword) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 이메일 형식 체크 함수
  const isEmailValid = (loginEmail) => {
    return String(loginEmail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // 비밀번호 길이 체크 함수
  const isPasswordValid = (loginPassword) => {
    return loginPassword.length >= 6 && loginPassword.length <= 16;
  };

  useEffect(() => {
    // 이메일 검사
    if (!isEmailValid(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
    } else {
      setEmailError('');
    }

    // 비밀번호 길이 검사
    if (!isPasswordValid(password)) {
      setPasswordError('비밀번호는 6글자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  }, [email, password]);

  return { email, setEmail, password, setPassword, emailError, passwordError };
};

export default useSigninValidation;
