// axios 라이브러리 import
import axios from 'axios';

// ✅ [1] 이미지 업로드 함수
// - 인자로 받은 imageFile을 서버에 전송
export const uploadReceipt = (imageFile) => {
  const formData = new FormData(); // FormData 객체 생성 (파일 전송용)
  formData.append('image', imageFile); // 'image' 필드에 파일 추가

  const token = localStorage.getItem('token'); // 로그인 토큰 불러오기

  // 서버로 POST 요청 보내기
  return axios.post('/myapp/api/receipt-upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 파일 업로드용 헤더
      Authorization: `Token ${token}` // 인증 토큰 헤더에 포함
    }
  });
};

// ✅ [2] OCR 결과 조회 함수
// - 업로드한 영수증에 대한 텍스트 추출 결과 요청
export const fetchOcrResult = (receiptId) => {
  const token = localStorage.getItem('token'); // 로그인 토큰 불러오기
  console.log(token)
  // 서버로 GET 요청 보내기 (영수증 ID를 쿼리로 전달)
  return axios.get(`/myapp/api/ocr-result/?receipt_id=${receiptId}`, {
    headers: {
      Authorization: `Token ${token}` // 인증 토큰 포함
    }
  });
};
