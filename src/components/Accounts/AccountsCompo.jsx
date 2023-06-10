import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import styles from './AccountsCompo.module.scss';

function AccountsCompo({ isLogin }) {
  const [formState, setFormState] = useState({
    username: { value: '', valid: false, message: '', touched: false },
    email: { value: '', valid: false, message: '', touched: false },
    domain: { value: '', valid: true, message: '', touched: false },
    password: { value: '', valid: false, message: '', touched: false },
    passwordConfirm: { value: '', valid: false, message: '', touched: false },
  });

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();
  if (isLogin) {
    navigate('/');
  }

  // GET: (input 입력 전)회원정보 받기 요청
  useEffect(() => {
    const fetchAccountInfo = async () => {
      // 1. fetch로 데이터를 받아온다
      try {
        const response = await fetch('/api/v1/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const accountData = await response.json();
        console.log(accountData);

        // 2. 응답을 받는다면 200
        if (response.status === 200) {
          const { email, username } = accountData.data;
          console.log('User email:', email);
          console.log('User username:', username);

          setFormState((prevState) => ({
            ...prevState,
            username: { value: username, valid: true, touched: true },
            email: { value: email, valid: true, touched: true },
            // password: {
            //   value: '',
            //   valid: false,
            //   message: '',
            //   touched: false,
            // },
            // passwordConfirm: {
            //   value: '',
            //   valid: false,
            //   message: '',
            //   touched: false,
            // },
          }));
        } else {
          console.error(`Error: ${accountData.error.message}`);
        }
      } catch (error) {
        console.log('get요청 실패', error);
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

      // 메일 유효성 검사 (도메인과 분리) -> 그냥 합치자
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
        console.log('회원정보가 수정되었습니다.');
      } else {
        console.error(`Error: ${data.error.message}`);
      }
    } catch (error) {
      console.log('put요청 실패', error);
    }
  };

  // 회원정보 수정 취소
  const CancelAccountChange = () => {
    console.log('수정 눌림');
  };

  // DELETE: 탈퇴(회원정보 삭제) 요청
  const DeleteAccount = async (e) => {
    e.preventDefault();
    console.log('삭제 눌림');
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
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

// 만들 기능 ~

// 1. api받기: 기존 닉네임, 이메일, 비밀번호(별표나 빈칸으로)가 뜬다!!!!placeholder아님
// 2. 각각 새 정보 입력하며 각 input에 있는 수정!!!버튼 누르면
// ->기존 값이 변한다!!!! + 인풋들 밑에 문구 생긴다!!!! : 수정되었습니다(수정 버튼이 없어지는게 더 나음? 그게 멋져보인단 개인적 느낌)
// 3. 수정확인을 누르면 각 input밑의 수정 문구가 없어진다 + 알림: 정보가 수정되었습니다
// 4. 취소를 누르면 기존 값들이 input에 뜬다 + 알림: 정보 수정이 취소되었습니다

// 위의 것들 다 만들면 사진 넣는 기능 고 + placeholder? 가로 몇 세로 몇 픽셀의 이미지로 넣어

// 할 일 : 페치,기능 하나씩 추가하자.
// 유효성 -> +get -> +put,수정 -> +취소하기 -> +탈퇴하기

////////////////////////////////////
// 밑은 파이어베이스 내장함수 사용 버전..을 쓰려고 한다
////////////////////////////////////

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import styles from './AccountsCompo.module.scss';

// function AccountsCompo({ isLogin }) {
//   const [formState, setFormState] = useState({
//     username: { value: '', valid: false, message: '', touched: false },
//     email: { value: '', valid: false, message: '', touched: false },
//     domain: { value: '', valid: true, message: '', touched: false },
//     password: { value: '', valid: false, message: '', touched: false },
//     passwordConfirm: { value: '', valid: false, message: '', touched: false },
//   });

//   // 로그인 되어있으면 홈('/')으로 이동
//   const navigate = useNavigate();
//   if (isLogin) {
//     navigate('/');
//   }

//   useEffect(() => {
//     const fetchAccountInfo = async () => {
//       try {
//         const response = await fetch('/api/v1/accounts', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setFormState((prevState) => ({
//             ...prevState,
//             username: { value: data.username, valid: true, touched: true },
//             email: { value: data.email, valid: true, touched: true },
//             password: { value: '', valid: false, message: '', touched: false },
//             passwordConfirm: {
//               value: '',
//               valid: false,
//               message: '',
//               touched: false,
//             },
//           }));
//         } else {
//           throw new Error('Network response was not ok.');
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchAccountInfo();
//   }, []);

//   // 입력 시 값 갱신, 유효성 검사
//   const onChange = (e) => {
//     const {
//       target: { name, value },
//     } = e;

//     // newState를 formState의 이전 상태를 기반으로 정의
//     setFormState((prevState) => {
//       const newState = {
//         ...prevState[name],
//         value: value,
//         touched: true,
//         edited: true,
//       };

//       // 닉네임이 3~12자인지 확인 (가입버튼 누르기 전)
//       if (name === 'username') {
//         if (value.length < 3 || value.length > 12) {
//           newState.message = '닉네임은 최소 3자 이상 12자 이하이어야 합니다.';
//           newState.valid = false;
//         } else {
//           newState.message = '유효한 닉네임입니다.';
//           newState.valid = true;
//         }
//       }

//       // 메일 유효성 검사 (도메인과 분리) -> 그냥 합치자
//       if (name === 'email') {
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(value)) {
//           newState.message = '유효한 이메일을 입력해주세요.';
//           newState.valid = false;
//         } else {
//           newState.message = '유효한 이메일입니다.';
//           newState.valid = true;
//         }
//       }

//       // 비밀번호에 닉네임이나 이메일 주소가 포함되어 있는지, 6~16자 이내인지 확인 (가입버튼 누르기 전)
//       if (name === 'password') {
//         const containsNumber = /\d/.test(value);
//         const containsCharacter = /[a-zA-Z]/.test(value);
//         const containsSpecialCharacter = /\W/.test(value);
//         const countValidations = [
//           containsNumber,
//           containsCharacter,
//           containsSpecialCharacter,
//         ].filter(Boolean).length;

//         if (
//           value.includes(formState.username.value) ||
//           value.includes(formState.email.value) ||
//           value.length < 6 ||
//           value.length > 16 ||
//           countValidations < 2
//         ) {
//           newState.message =
//             '비밀번호는 6자 이상 16자 이하이어야 하며, 닉네임과 이메일을 포함할 수 없습니다. 또한, 숫자, 문자, 특수 문자 중 적어도 두 가지를 포함해야 합니다.';
//           newState.valid = false;
//         } else {
//           newState.message = '유효한 비밀번호입니다.';
//           newState.valid = true;
//         }
//       }

//       // 비밀번호 확인
//       if (name === 'passwordConfirm') {
//         if (value !== formState.password.value) {
//           newState.message = '비밀번호가 일치하지 않습니다.';
//           newState.valid = false;
//         } else {
//           newState.message = '비밀번호가 일치합니다.';
//           newState.valid = true;
//         }
//       }

//       return { ...prevState, [name]: newState };
//     });
//   };

//   // 회원가입 기능 수행 <- 조건들
//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const isFormValid = Object.values(formState).every((field) => field.valid);
//     if (!isFormValid) {
//       return;
//     }

//     try {
//       const response = await fetch('/api/v1/accounts', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formState.username.value,
//           email: formState.email.value,
//           password: formState.password.value,
//         }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           console.log('회원정보가 수정되었습니다.');
//         } else {
//           throw new Error(data.message);
//         }
//       } else {
//         throw new Error('Network response was not ok.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <>
//       <div className={styles.container}>
//         <div className={styles.title}>마이페이지</div>

//         <form onSubmit={onSubmit}>
//           <div>
//             <input
//               name="username"
//               type="text"
//               placeholder="닉네임"
//               value={formState.username.value}
//               onChange={onChange}
//               required
//               className={styles.inputBox}
//             />
//           </div>
//           <div>{formState.username.touched && formState.username.message}</div>
//           <div>
//             {/* {formState.nickname.edited && <div>닉네임이 수정되었습니다.</div>} */}
//           </div>

//           <div>
//             <input
//               name="email"
//               type="text"
//               placeholder="이메일"
//               value={formState.email.value}
//               onChange={onChange}
//               required
//               className={styles.inputBox}
//             />
//             {/* @
//             <select name="domain" onChange={onChange} required>
//               <option value="">도메인 선택</option>
//               <option value="gmail.com">gmail.com</option>
//               <option value="naver.com">naver.com</option>
//               <option value="daum.net">daum.net</option>
//               <option value="hanmail.net">hanmail.net</option>
//               <option value="msn.com">msn.com</option>
//               <option value="nate.com">nate.com</option>
//             </select> */}
//             {/* {!formState.email.edited && (
//               <button onClick={() => onUpdate('email')}>수정</button>
//             )} */}
//           </div>
//           <div>{formState.email.touched && formState.email.message}</div>

//           <div>
//             {/* {formState.email.edited && <div>이메일이 수정되었습니다.</div>} */}
//           </div>

//           <div>
//             <input
//               name="password"
//               type="password"
//               placeholder="비밀번호"
//               value={formState.password.value}
//               onChange={onChange}
//               required
//               className={styles.inputBox}
//             />

//             <div>
//               {formState.password.touched && formState.password.message}
//             </div>
//           </div>

//           <div>
//             <input
//               name="passwordConfirm"
//               type="password"
//               placeholder="비밀번호 확인"
//               className={styles.inputBox}
//               value={formState.passwordConfirm.value}
//               onChange={onChange}
//               required
//             />
//             {/* {!formState.password.edited && (
//               <button onClick={() => onUpdate('password')}>수정</button>
//             )} */}
//           </div>
//           <div>
//             {formState.passwordConfirm.touched &&
//               formState.passwordConfirm.message}
//           </div>

//           <div>
//             <input
//               type="submit"
//               value="수정 완료하기"
//               className={styles.registerBtn}
//               disabled={!Object.values(formState).every((field) => field.valid)}
//             />
//           </div>

//           <div>
//             <input
//               type="submit"
//               value="수정 취소하기"
//               className={styles.registerBtn}
//               disabled={
//                 !formState.username.valid ||
//                 !formState.email.valid ||
//                 !formState.password.valid ||
//                 !formState.passwordConfirm.valid
//               }
//             />
//           </div>

//           <div>
//             <input
//               type="submit"
//               value="탈퇴하기"
//               className={styles.registerBtn}
//             />
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }

// export default AccountsCompo;
