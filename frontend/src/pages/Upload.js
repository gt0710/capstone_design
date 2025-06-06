import React, { useState } from 'react';
import Header from '../components/Header';
import { uploadReceipt, fetchOcrResult } from '../api/receipt';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [image, setImage] = useState(null);
  const [uploadResult, setUploadResult] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [selectedLines, setSelectedLines] = useState([]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!image) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      const uploadResponse = await uploadReceipt(image);
      const { id, image: imagePath } = uploadResponse.data;
      setUploadResult('업로드 성공');
      setUploadedImageUrl(imagePath);

      const ocrResponse = await fetchOcrResult(id);
      setOcrText(ocrResponse.data.extracted_text);
    } catch (err) {
      console.error(err);
      setUploadResult('업로드 실패');
    }
  };

  const handleCheckboxChange = (line) => {
    setSelectedLines((prev) =>
      prev.includes(line)
        ? prev.filter((item) => item !== line)
        : [...prev, line]
    );
  };

  const handleParseAndGoToRecommend = () => {
    if (selectedLines.length === 0) {
      alert('하나 이상의 항목을 선택해주세요.');
      return;
    }

    // Recommend 페이지로 품목들 전달
    navigate('/Recommend', {
      state: {
        items: selectedLines
      }
    });
  };

  const lines = ocrText.split('\n').filter((line) => line.trim() !== '');

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">영수증 업로드</h1>

        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />

        <button
          onClick={handleUploadAndAnalyze}
          className="bg-[#3b3b3a] text-white px-4 py-2 rounded hover:bg-[#161514] transition"
        >
          서버에 업로드 및 분석
        </button>

        {uploadResult && (
          <div className="mt-4 flex items-center text-green-600">
            <span className="mr-2">✅</span> {uploadResult}
          </div>
        )}

        {uploadedImageUrl && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">업로드된 이미지</h2>
            <img
              src={uploadedImageUrl}
              alt="업로드된 이미지"
              className="w-full max-w-md border rounded"
            />
          </div>
        )}

        {ocrText && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">분석된 텍스트</h2>
            <form className="bg-white p-4 rounded border">
              {lines.map((line, index) => (
                <label key={index} className="block mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={line}
                    checked={selectedLines.includes(line)}
                    onChange={() => handleCheckboxChange(line)}
                    className="mr-2"
                  />
                  {line}
                </label>
              ))}

              <button
                type="button"
                onClick={handleParseAndGoToRecommend}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                선택한 항목으로 식단 추천 페이지로 이동
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Upload;
