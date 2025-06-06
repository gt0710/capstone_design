// React 및 라우터 관련 라이브러리 import
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
// 인증 상태를 위한 커스텀 훅
import { useAuth } from '../contexts/AuthContext';
// 알림 컴포넌트
import Alert from './Alert'; 

// 인증이 필요한 라우트 컴포넌트
function RequireAuth({ children }) {
  // 현재 로그인 상태 가져오기
  const { isLoggedIn } = useAuth();

  // 현재 경로 정보
  const location = useLocation();

  // 알림 표시 여부 상태
  const [showAlert, setShowAlert] = useState(false);
  // 사용자가 알림을 닫았는지 여부
  const [dismissed, setDismissed] = useState(false);
  // 알림 닫은 후 실제로 리다이렉트할지 여부
  const [redirectNow, setRedirectNow] = useState(false);

  // 로그인 안 되어 있고 알림 아직 안 닫았으면 알림 보여줌
  useEffect(() => {
    if (!isLoggedIn && !dismissed) {
      setShowAlert(true);
    }
  }, [isLoggedIn, location.pathname]); // 로그인 상태나 경로가 바뀌면 실행

  // 알림 닫기 버튼 누르면 실행되는 함수
  const handleClose = () => {
    setShowAlert(false);      // 알림 숨김
    setDismissed(true);       // 사용자가 닫았다고 표시
    setRedirectNow(true);     // 실제로 리다이렉트 실행
  };

  // 로그인이 안 된 상태일 때 처리
  if (!isLoggedIn) {
    if (redirectNow) {
      // 로그인 페이지로 리다이렉트 (기존 경로는 state로 전달)
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // 알림 메시지 표시 (로그인 필요 안내)
    return (
      <div className="flex justify-center mt-4">
        <Alert message="로그인이 필요합니다" type="warning" onClose={handleClose} />
      </div>
    );
  }

  // 로그인 상태라면 원래 컴포넌트(children) 렌더링
  return children;
}

export default RequireAuth;
