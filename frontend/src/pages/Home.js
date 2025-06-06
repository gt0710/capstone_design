import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import Header from '../components/Header';
import axios from 'axios';

function Home() {
  const { inventoryCount } = useInventory();
  const [mealPreview, setMealPreview] = useState('');

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/myapp/api/recommend_meal/',
          { items: [] }, // 홈에서는 전체 추천 요청 (or 기본값 요청)
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const fullText = response.data.recommendation || '';
        const firstParagraph = fullText.split('<br>')[0]?.trim(); // 첫 문단만
        setMealPreview(firstParagraph);
      } catch (err) {
        console.error('식단 추천 미리보기 실패:', err);
        setMealPreview('추천 정보를 불러올 수 없습니다.');
      }
    };

    fetchRecommendation();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">대시보드</h1>

        <div className="flex flex-col gap-6 mb-8">
          {/* 추천 식단 미리보기 카드 */}
          <Link
            to="/Recommend"
            className="bg-white p-6 rounded shadow hover:shadow-md transition"
          >
            <p className="text-lg font-semibold mb-2 text-gray-700">추천 식단 미리보기</p>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{mealPreview.replaceAll('<br>', '\n')}</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
