// src/pages/Inventory.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import Header from '../components/Header';

function Inventory() {
  const location = useLocation();
  const ocrText = location.state?.ocrText || ''; // 업로드 화면에서 전달된 OCR 텍스트
  const { setInventory } = useInventory(); // 전역 재고 상태 업데이트 함수

  const [localInventory, setLocalInventory] = useState([]); // 로컬 재고 상태

  useEffect(() => {
    if (!ocrText) return;

    // OCR 텍스트에서 품목 및 수량을 추출하여 재고 생성
    const extractInventory = (text) => {
      const lines = text.split('\n'); // 줄마다 분리
      const items = [];

      lines.forEach((line) => {
        // 품목명(한글/영문/숫자) + 수량(숫자) 추출
        const match = line.match(/([\w가-힣]+)\s?(\d+)?/);
        if (match) {
          // 유통기한을 임의로 1~10일 사이 설정
          const daysLeft = Math.floor(Math.random() * 10) + 1;
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + daysLeft);

          items.push({
            name: match[1], // 품목명
            quantity: match[2] ? parseInt(match[2]) : 1, // 수량 (없으면 기본값 1)
            expiry: expiry.toISOString().split('T')[0], // YYYY-MM-DD 형태
            daysLeft, // 남은 유통기한 일수
          });
        }
      });

      setLocalInventory(items); // 로컬 상태 저장
      setInventory(items);     // 전역 상태 저장 (Context)
    };

    extractInventory(ocrText);
  }, [ocrText, setInventory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">재고 현황</h1>

        {localInventory.length === 0 ? (
          <p>분석할 텍스트가 없습니다.</p>
        ) : (
          <table className="w-full border rounded text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">품목</th>
                <th className="p-2 border">수량</th>
                <th className="p-2 border">유통기한</th>
                <th className="p-2 border">남은 일수</th>
              </tr>
            </thead>
            <tbody>
              {localInventory.map((item, idx) => (
                <tr key={idx} className={item.daysLeft <= 3 ? 'bg-red-100' : ''}> {/* 유통기한 임박시 강조 */}
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.expiry}</td>
                  <td className="p-2 border">{item.daysLeft}일</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Inventory;
