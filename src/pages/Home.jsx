// import React from 'react';
// import HomeCompo from '../components/Home/HomeCompo.jsx';

// function Home() {
//   return <HomeCompo></HomeCompo>;
// }

// export default Home;

import { auth } from '../firebase/firebase';

function Home() {
  /** 로그아웃 기능 수행 */
  const onClick = () => auth.signOut();

  return (
    <>
      <div>홈</div>
      <button onClick={onClick}>로그아웃</button>
    </>
  );
}

export default Home;
