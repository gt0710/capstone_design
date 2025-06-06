import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 회원가입
export const registerUser = (formData) => {
  return api.post('/myapp/api/signup/', {
    username: formData.username,  // ✅ username으로 통일
    password: formData.password,
  }, {
    headers: {
      Authorization: undefined,
    }
  });
};

// ✅ 로그인
export const loginUser = (formData) => {
  return api.post('/myapp/api/login/', {
    username: formData.username,
    password: formData.password,
  });
};
