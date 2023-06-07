import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GetSampleBoard from './pages/GetSampleBoard';
import MakeBoardName from './pages/MakeBoardName';
import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
import VisionBoardGrid from './pages/VisionBoardGrid';
import SavedUserVisionBoard from './pages/SavedUserVisionBoard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/getsampleboard', element: <GetSampleBoard /> },
      { path: '/makeboardName', element: <MakeBoardName /> },
      { path: '/myvisionboard', element: <MyVisionBoard /> },
      // { path: '/login', element: <SignIn /> },
      // { path: '/register', element: <SignUp /> },
      { path: '/myvisionboardgrid', element: <MyVisionBoardGrid /> },
      { path: '/visionboardgrid', element: <VisionBoardGrid /> },
      { path: '/saveduservisionboard', element: <SavedUserVisionBoard /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
