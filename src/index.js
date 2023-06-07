// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import App from './App';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import GetSampleBoard from './pages/GetSampleBoard';
// import MakeBoardName from './pages/MakeBoardName';
// import MyVisionBoard from './pages/MyVisionBoard';
// import MyVisionBoardGrid from './pages/MyVisionBoardGrid';

// import SignIn from './components/SignIn/SignIn';
// import SignUp from './components/SignUp/SignUp';
// // import Accounts from './components/Accounts/Accounts';
// import VisionBoardGrid from './pages/VisionBoardGrid';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       { path: '/getsampleboard', element: <GetSampleBoard /> },
//       { path: '/makeboardName', element: <MakeBoardName /> },
//       { path: '/myvisionboard', element: <MyVisionBoard /> },
//       { path: '/login', element: <SignIn /> },
//       { path: '/register', element: <SignUp /> },
//       // { path: '/accounts', element: <Accounts /> },
//       { path: '/myvisionboardgrid', element: <MyVisionBoardGrid /> },
//       { path: '/visionboardgrid', element: <VisionBoardGrid /> },
//     ],
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

// 'react-router-dom' v6을 사용 중이라 API가 전과 다르게 변경
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetSampleBoard from './pages/GetSampleBoard';
import MakeBoardName from './pages/MakeBoardName';
import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';

import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
// import Accounts from './pages/Accounts/Accounts';
import VisionBoardGrid from './pages/VisionBoardGrid';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
        {/* <Route path="/getsampleboard" element={<GetSampleBoard />} />
        <Route path="/makeboardName" element={<MakeBoardName />} />
        <Route path="/myvisionboard" element={<MyVisionBoard />} /> */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        {/* <Route path="/accounts" element={<Accounts />} /> */}
        {/* <Route path="/myvisionboardgrid" element={<MyVisionBoardGrid />} />
        <Route path="/visionboardgrid" element={<VisionBoardGrid />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
