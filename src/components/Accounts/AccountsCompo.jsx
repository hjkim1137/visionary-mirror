import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './AccountsCompo.module.scss';

function AccountsCompo({ isLogin }) {
  const [formState, setFormState] = useState({
    username: { value: '', valid: false, message: '', touched: false },
    email: { value: '', valid: false, message: '', touched: false },
    password: { value: '', valid: true, message: '', touched: false },
    passwordConfirm: { value: '', valid: true, message: '', touched: false },
  });
  // 사용자 기존 정보 변수
  const [originalState, setOriginalState] = useState(null);
  console.log('formState: ', formState);

  // 로그인 되어있으면 홈('/')으로 이동
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);
  console.log('formState: ', formState);

  //GET: (input 입력 전)회원정보 받기 요청: password는 없음
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('/api/v1/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 응답 없을 때
        if (!response.ok) {
          throw new Error('서버로부터 응답이 없습니다.');
        }

        // 응답을 json으로 파싱
        const data = await response.json();

        // 응답, 에러 처리
        if (response.status === 200) {
          const { username, email } = data.data;
          const newState = {
            username: { value: username, valid: true, touched: true },
            email: { value: email, valid: true, touched: true },
          };

          // 사용자 기본 정보 변수에 정보 넣기
          setFormState((prevState) => ({
            ...prevState,
            username: { value: username, valid: true, touched: true },
            email: { value: email, valid: true, touched: true },
          }));
          setOriginalState(newState);
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
        console.log('회원정보 요청 실패', error.message);
        alert('알 수 없는 오류가 발생했습니다.다시 시도해 보세요.');
        window.location.reload();
      }
    };

    fetchAccountInfo();
  }, [navigate]);
  console.log('formState: ', formState);

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
      };

      // 닉네임이 3~12자인지 확인 (가입버튼 누르기 전)
      if (name === 'username') {
        if (value.length < 3 || value.length > 10) {
          newState.message = '닉네임은 최소 3자 이상 10자 이하이어야 합니다.';
          newState.valid = false;
        } else {
          newState.message = '유효한 닉네임입니다.';
          newState.valid = true;
        }
      }

      // 메일 유효성 검사 (도메인과 분리) -> 그냥 합치자
      if (name === 'email') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
          newState.message = '유효한 이메일을 입력해주세요.';
          newState.valid = false;
        } else {
          newState.message = '유효한 이메일입니다.';
          newState.valid = true;
        }
      }

      if (name === 'password') {
        const containsNumber = /\d/.test(value);
        const containsCharacter = /[a-zA-Z]/.test(value);
        const containsSpecialCharacter = /\W/.test(value);
        const countValidations = [
          containsNumber,
          containsCharacter,
          containsSpecialCharacter,
        ].filter(Boolean).length;

        // 일단 로그인 조건에 맞춰 비밀번호는 6글자 이상으로만 제한
        if (
          formState.password.value.length < 6 ||
          formState.passwordConfirm.value.length < 6
        ) {
          newState.message = '비밀번호는 6자 이상이어야 합니다.';
          newState.valid = false;
        } else {
          newState.message = '유효한 비밀번호입니다.';
          newState.valid = true;
        }

        // 비밀번호, 비밀번호 확인 확인
        if (name === 'password' || name === 'passwordConfirm') {
          if (value.length > 0) {
            // 비밀번호가 비어있지 않은 경우에만 검사.
            if (value.length < 6) {
              newState.message = '비밀번호는 6자 이상이어야 합니다.';
              newState.valid = false;
            } else {
              newState.message = '유효한 비밀번호입니다.';
              newState.valid = true;
            }
          } else {
            // 비밀번호가 비어있는 경우 유효하다고 판단
            newState.message = '';
            newState.valid = true;
          }
        }

        if (name === 'passwordConfirm' && value.length > 0) {
          // 비밀번호 확인이 비어있지 않은 경우에만 검사를 진행
          if (!formState.password || formState.password.value === '') {
            newState.message = '먼저 비밀번호를 입력해주세요.';
            newState.valid = false;
          } else if (value !== formState.password.value) {
            newState.message = '비밀번호가 일치하지 않습니다.';
            newState.valid = false;
          } else {
            newState.message = '비밀번호가 일치합니다.';
            newState.valid = true;
          }
        }

        return { ...prevState, [name]: newState };
      }
    });
  };
  console.log('formState: ', formState);

  ////////////////////////////////////////////////////////
  //////////// 버튼들: 정보 수정, 취소, 탈퇴
  ////////////////////////////////////////////////////////

  // PUT: 회원정보 수정 요청
  const onSubmit = async (e) => {
    e.preventDefault();

    if (originalState.username === formState.username.value) {
      alert('닉네임을 변경해주세요.');
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
      });

      // 응답 없을 때
      if (!response.ok) {
        throw new Error('서버로부터 응답이 없습니다.');
      }

      const data = await response.json();

      if (response.status === 200) {
        // 일단 비밀번호 변경해도 로그인 된 것으로 한다.
        if (formState.password.value !== '') {
          alert('비밀번호가 변경되었습니다.');
          navigate('/');
        } else {
          alert('회원정보가 수정되었습니다.');
          window.location.reload(); // 수정 완료 후 현재 페이지를 새로고침
        }
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
      console.log('회원정보 수정 요청 실패', error);
      alert('회원정보 수정 요청에 실패하였습니다.다시 한번 해보세요.');
      window.location.reload();
    }
  };
  console.log('formState: ', formState);

  // 회원정보 수정 취소
  const CancelAccountChange = () => {
    if (originalState) {
      setFormState(originalState);
      alert('수정이 취소되었습니다.');
    } else {
      alert('아직 초기 데이터를 받지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
  console.log('formState: ', formState);

  // DELETE: 탈퇴(회원정보 삭제) 요청
  const DeleteAccount = async (e) => {
    e.preventDefault();
    console.log('삭제 눌림');

    try {
      const response = await fetch('/api/v1/accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // 응답 없을 때
      if (!response.ok) {
        throw new Error('서버로부터 응답이 없습니다.');
      }

      //http 응답 본문을 json으로 파싱: 서버의 데이터를 JS객체로 변환
      const data = await response.json();

      if (response.status === 200) {
        console.log('회원 탈퇴 성공');
        alert('탈퇴에 성공하였습니다.');
        navigate('/');

        // 상태 초기화
        setFormState({
          username: { value: '', valid: false, message: '', touched: false },
          email: { value: '', valid: false, message: '', touched: false },
          password: { value: '', valid: false, message: '', touched: false },
          passwordConfirm: {
            value: '',
            valid: false,
            message: '',
            touched: false,
          },
        });
        setOriginalState(null);
      } else if (response.status === 400) {
        alert('잘못된 요청입니다.');
        throw new Error(`잘못된 요청입니다.`);
      } else if (response.status === 401) {
        alert('인증되지 않은 사용자입니다.다시 로그인을 해주세요');
        localStorage.removeItem('isLogin');
        navigate('/login');
        throw new Error(`인증되지 않은 사용자입니다.`);
      } else if (response.status === 500) {
        alert('서버 오류가 발생했습니다.');
        throw new Error(`서버 오류가 발생했습니다.`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
        throw new Error(`알 수 없는 오류가 발생했습니다.`);
      }
    } catch (error) {
      console.error('회원 탈퇴 요청 실패', error);
      alert('회원에서 탈퇴하는데 실패했습니다.다시 시도해보세요');
      window.location.reload();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>마이페이지</div>

        <form>
          <div>
            <input
              name="username"
              type="text"
              placeholder="닉네임"
              value={formState.username ? formState.username.value : ''}
              onChange={onChange}
              required
              className={styles.inputBox}
            />
          </div>
          <div>{formState.username.touched && formState.username.message}</div>
          <div>
            {/* {formState.nickname.edited && <div>닉네임이 수정되었습니다.</div>} */}
          </div>

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
            {/* @
            <select name="domain" onChange={onChange} required>
              <option value="">도메인 선택</option>
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="msn.com">msn.com</option>
              <option value="nate.com">nate.com</option>
            </select> */}
            {/* {!formState.email.edited && (
              <button onClick={() => onUpdate('email')}>수정</button>
            )} */}
          </div>
          <div>{formState.email.touched && formState.email.message}</div>
          {console.log(formState.password)}
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
            {/* {!formState.password.edited && (
              <button onClick={() => onUpdate('password')}>수정</button>
            )} */}
          </div>
          <div>
            {formState.passwordConfirm.touched &&
              formState.passwordConfirm.message}
          </div>

          <div>
            <input
              type="submit"
              value="수정 완료하기"
              className={styles.registerBtn}
              disabled={
                originalState?.username === formState.username.value ||
                !formState.username.valid
              }
            />
          </div>

          <div>
            <input
              type="submit"
              value="수정 취소하기"
              className={styles.registerBtn}
            />
          </div>

          <div>
            <input
              type="submit"
              value="탈퇴하기"
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
