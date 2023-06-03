// 컬렉션 삭제 custom hook

import { useCallback } from 'react';

const useDeleteCollection = (collection, setCollection, mockAPI) => {
  const handleDeleteButtonClick = useCallback(
    async (index) => {
      // 선택한 컬렉션 제목 및 삭제 확인
      const itemTitle = collection.title[index];
      const confirmDelete = window.confirm(
        `${itemTitle} 컬렉션을 삭제하시겠습니까?`
      );
      if (!confirmDelete) {
        return;
      }

      // 선택한 컬렉션 삭제 API 호출
      const response = await fetch(`${mockAPI}/${collection.id[index]}`, {
        method: 'DELETE',
      });

      // 삭제 성공 여부 확인
      if (!response.ok) {
        console.error('삭제가 실패하였습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      // 삭제 완료 알림
      alert(`${itemTitle} 컬렉션이 정상적으로 삭제되었습니다.`);

      // 삭제 후 컬렉션 업데이트
      const remainingItems = {
        img: collection.img.filter((_, idx) => idx !== index),
        title: collection.title.filter((_, idx) => idx !== index),
        id: collection.id.filter((_, idx) => idx !== index),
      };

      setCollection(remainingItems);
    },
    [collection, setCollection, mockAPI]
  );

  return handleDeleteButtonClick;
};

export default useDeleteCollection;
