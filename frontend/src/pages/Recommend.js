import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Recommend() {
  const location = useLocation();
  const { items } = location.state || {};
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!items || items.length === 0) return;

      setLoading(true);
      setRecommendation('');

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/myapp/api/recommend_meal/', {
          items: items
        }, {
          headers: {
            Authorization: `Token ${token}`,
          }
        });

        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error('추천 실패:', error);
        setRecommendation('식단 추천을 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [items]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">식단 추천</h1>

        {items && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">선택된 재고</h2>
            <ul className="list-disc pl-5 bg-white p-4 border rounded">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {loading && <p className="text-gray-600">추천을 불러오는 중...</p>}

        {recommendation && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">추천된 식단</h2>
            <pre className="bg-white p-4 border rounded whitespace-pre-wrap">
              {recommendation.replaceAll('<br>', '\n')}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default Recommend;
