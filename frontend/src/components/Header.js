import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isLoggedIn, setIsLoggedIn, username } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsMenuOpen(false);
    }, 1000); // 1초 후에 닫힘
    setTimeoutId(id);
  };

  return (
    <header className="bg-[#161514] text-white">
      <div className="p-4 px-8 border-b border-gray-700 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">영수증 관리 시스템</Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="text-sm bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white transition"
          >
            로그인
          </Link>
        ) : (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* 유저 이미지 */}
            <div className="w-10 h-10 rounded-md overflow-hidden bg-white cursor-pointer">
              <img
                src="/user.png"
                alt="유저 프로필"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-md rounded-md w-48 z-50">
                <div className="px-3 py-2 font-semibold text-sm text-gray-700 border-b border-gray-200 mb-1">
                  {username}
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 메뉴바 */}
      <nav className="flex justify-start space-x-8 px-8 py-3 border-b border-gray-700">
        <Link to="/Recommend" className="text-gray-400 hover:text-white transition">식단 추천</Link>
        <Link to="/Upload" className="text-gray-400 hover:text-white transition">영수증 업로드</Link>
        <Link to="/Settings" className="text-gray-400 hover:text-white transition">설정</Link>
      </nav>
    </header>
  );
}

export default Header;
