// React 및 ReactDOM 모듈 import
import React from 'react';
import ReactDOM from 'react-dom/client';
// 전역 스타일시트 import
import './index.css';
// 라우터 컴포넌트 (페이지 이동 관리)
import AppRouter from './AppRouter';
// 로그인 상태 관리 Context Provider
import { AuthProvider } from './contexts/AuthContext';
// 재고 상태 관리 Context Provider
import { InventoryProvider } from './contexts/InventoryContext';

import axios from 'axios';


const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`;
}

// root DOM 요소를 기준으로 React 앱 초기화
const root = ReactDOM.createRoot(document.getElementById('root'));

// 앱 렌더링 시작
root.render(
  <React.StrictMode>
    {/* 로그인 상태를 전역으로 관리 */}
    <AuthProvider>
      {/* 재고 상태를 전역으로 관리 */}
      <InventoryProvider>
        {/* 실제 라우팅 및 페이지 구조 */}
        <AppRouter />
      </InventoryProvider>
    </AuthProvider>
  </React.StrictMode>
);
