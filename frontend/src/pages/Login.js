import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setUsername } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(form);
      const token = response.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('username', form.username);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      setIsLoggedIn(true);
      setUsername(form.username);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  const handleAlertClose = () => {
    setShowSuccess(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error && <Alert message={error} onClose={() => setError('')} />}
      {showSuccess && <Alert message="로그인 성공!" onClose={handleAlertClose} />}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">로그인</h2>

        <label className="block mb-2 text-sm font-medium text-gray-600">아이디 (username)</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 text-sm font-medium text-gray-600">비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 border rounded"
        />

        <button type="submit" className="w-full bg-[#3b3b3a] text-white py-2 px-4 rounded hover:bg-[#161514] transition">
          로그인
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">계정이 없으신가요? </span>
          <a href="/register" className="text-sm text-blue-600 hover:underline">
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
