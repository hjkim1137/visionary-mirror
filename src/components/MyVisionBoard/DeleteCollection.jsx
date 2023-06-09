// 컬렉션 삭제 커스텀 훅

import { useCallback, useState } from 'react';

const useDeleteCollection = (
  collection,
  setCollection,
  myvisioboardAPI,
  setIndex
) => {
  const [loading, setLoading] = useState(false);

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

      setLoading(true); // 로딩 시작

      try {
        // 선택한 컬렉션 삭제 API 호출
        const response = await fetch(
          `${myvisioboardAPI}/${collection.id[index]}`,
          {
            method: 'DELETE',
          }
        );
        console.log('삭제 요청 응답', response);

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

        // 만약 삭제한 아이템이 마지막 아이템이라면, 현재 슬라이드를 첫번째 인덱스로 설정
        if (index === collection.img.length - 1) {
          setIndex(0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    },
    [collection, setCollection, myvisioboardAPI, setIndex]
  );

  return [handleDeleteButtonClick, loading]; // 삭제 함수 및 로딩 상태 반환
};

export default useDeleteCollection;
