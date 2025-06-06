import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import Alert from '../components/Alert';

function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      const regex = /^[a-zA-Z0-9]*$/;
      if (!regex.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await registerUser({
        username: form.username,
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.password?.[0] ||
        '회원가입 실패';
      setError(msg);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error && <Alert message={error} onClose={() => setError('')} />}
      {success && <Alert message="회원가입 성공!" onClose={handleSuccessClose} />}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">회원가입</h2>

        <label className="block mb-2 text-sm font-medium text-gray-600">아이디 (username)</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 mb-1 border rounded"
        />
        <p className="text-xs text-gray-500 mb-3">영문자와 숫자만 입력 가능합니다.</p>

        <label className="block mb-2 text-sm font-medium text-gray-600">비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 text-sm font-medium text-gray-600">비밀번호 확인</label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <button type="submit" className="w-full bg-[#3b3b3a] text-white py-2 px-4 rounded hover:bg-[#161514] transition">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Register;
