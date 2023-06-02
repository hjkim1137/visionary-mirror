// import React from 'react';
// import Header from '../components/Header/Header';

// function Layout() {
//   return <Header></Header>;
// }

// export default Layout;

import React from 'react';
import Header from '../components/Header/Header';

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default Layout;
