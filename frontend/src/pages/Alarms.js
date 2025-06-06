import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header'; // ✅ Header import

function Alarms() {
  const location = useLocation();
  const ocrText = location.state?.ocrText || '';
  const [expiringItems, setExpiringItems] = useState([]);

  useEffect(() => {
    if (!ocrText) return;

    const extractExpiringItems = (text) => {
      const lines = text.split('\n');
      const items = [];

      lines.forEach((line) => {
        const match = line.match(/([\w가-힣]+)\s?(\d+)?/);
        if (match) {
          const daysLeft = Math.floor(Math.random() * 10) + 1;
          if (daysLeft <= 3) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + daysLeft);

            items.push({
              name: match[1],
              quantity: match[2] ? parseInt(match[2]) : 1,
              expiry: expiry.toISOString().split('T')[0],
              daysLeft,
            });
          }
        }
      });

      setExpiringItems(items);
    };

    extractExpiringItems(ocrText);
  }, [ocrText]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header /> {/* ✅ Header 포함 */}
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">임박 알림</h1>

        {expiringItems.length === 0 ? (
          <p>임박한 재고가 없습니다.</p>
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
              {expiringItems.map((item, idx) => (
                <tr key={idx} className="bg-red-100">
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.expiry}</td>
                  <td className="p-2 border">{item.daysLeft}일</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Alarms;
