import React from 'react';
import Header from '../components/Header';

function Settings() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 공통 헤더 */}
      <Header />

      {/* 본문 영역 */}
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">설정</h1>
        <p className="text-gray-700">여기서 사용자 알림 설정, 선호도 설정 등을 할 수 있어요.</p>
      </main>
    </div>
  );
}

export default Settings;
