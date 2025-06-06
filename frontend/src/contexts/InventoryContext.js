import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]); // OCR로 추출된 재고 목록 저장

  // 재고 수량 총합 계산
  const inventoryCount = inventory.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // 유통기한 3일 이하인 품목 개수 계산
  const alarmCount = inventory.filter(item => item.daysLeft !== undefined && item.daysLeft <= 3).length;

  return (
    <InventoryContext.Provider value={{ inventory, setInventory, inventoryCount, alarmCount }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
