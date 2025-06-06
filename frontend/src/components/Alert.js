// React 라이브러리 import
import React from 'react';

// Alert 컴포넌트 정의
// - message: 알림 메시지 텍스트
// - type: 알림 유형 (기본값 'info') → 현재는 사용되지 않지만 확장 가능
// - onClose: 확인 버튼 클릭 시 실행할 콜백 함수
function Alert({ message, type = 'info', onClose }) {
  return (
    // 전체 화면을 어둡게 덮는 반투명 배경 (모달용)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 알림 박스 본체 */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        {/* 메시지 출력 */}
        <div className="text-lg font-semibold text-gray-800 mb-4">{message}</div>

        {/* onClose가 전달된 경우 확인 버튼 표시 */}
        {onClose && (
          <button
            onClick={onClose} // 버튼 클릭 시 onClose 함수 실행
            className="mt-2 px-4 py-2 bg-[#3b3b3a] text-white rounded hover:bg-[#161514] transition"
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
