// import { useState, useEffect } from 'react';

// export const useAccountValidation = (
//   username,
//   email,
//   password,
//   confirmPassword
// ) => {
//   const [usernameError, setUsernameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState(null);
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');

//   useEffect(() => {
//     if (username.length < 3 || username.length > 10) {
//       setUsernameError('닉네임은 3~10자 사이여야 합니다.');
//     } else {
//       setUsernameError('');
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('이메일 형식이 올바르지 않습니다.');
//     } else {
//       setEmailError('');
//     }

//     if (password.length < 6 || password.length > 16) {
//       setPasswordError({
//         line1: '비밀번호는 6글자 이상이어야 합니다.',
//         line2: '비밀번호는 16글자를 초과할 수 없습니다.',
//       });
//     } else {
//       setPasswordError(null);
//     }

//     if (password !== confirmPassword) {
//       setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
//     } else {
//       setConfirmPasswordError('');
//     }
//   }, [username, email, password, confirmPassword]);

//   return { usernameError, emailError, passwordError, confirmPasswordError };
// };

import { useState, useEffect } from 'react';

export const useAccountValidation = (
  username,
  email,
  password,
  confirmPassword
) => {
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (username.length < 3 || username.length > 10) {
      setUsernameError('닉네임은 3~10자 사이여야 합니다.');
    } else {
      setUsernameError('');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
    } else {
      setEmailError('');
    }

    if (password.length < 6 || password.length > 16) {
      setPasswordError({
        line1: '비밀번호는 6글자 이상이어야 합니다.',
        line2: '비밀번호는 16글자를 초과할 수 없습니다.',
      });
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  }, [username, email, password, confirmPassword]);

  return { usernameError, emailError, passwordError, confirmPasswordError };
};
