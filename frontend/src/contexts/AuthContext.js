import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 인증 상태를 관리할 Context 생성
const AuthContext = createContext();

// 인증 상태를 제공하는 컴포넌트 (Provider)
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // ✅ [1] 앱 로딩 시 localStorage에서 토큰/유저 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  }, []);

  // ✅ [2] 로그아웃 함수 추가
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];

    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        logout, // ✅ 로그아웃 함수 제공
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅으로 Context 사용
export function useAuth() {
  return useContext(AuthContext);
}
