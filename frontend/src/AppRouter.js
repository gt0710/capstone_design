// React 및 React Router 라이브러리 import
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 import
import Home from './pages/Home';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Alarms from './pages/Alarms';
import Recommend from './pages/Recommend';

// 로그인 여부를 확인하는 보호 컴포넌트
import RequireAuth from './components/RequireAuth';

// 앱 라우터 컴포넌트 정의
function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 공개 라우트 (로그인 없이 접근 가능) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 보호 라우트 (RequireAuth로 로그인 확인 필요) */}
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path="/Settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route
          path="/alarms"
          element={
            <RequireAuth>
              <Alarms />
            </RequireAuth>
          }
        />
        <Route
          path="/recommend"
          element={
            <RequireAuth>
              <Recommend />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

// AppRouter 컴포넌트를 외부에서 사용할 수 있도록 export
export default AppRouter;
