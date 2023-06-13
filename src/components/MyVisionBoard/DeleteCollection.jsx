//최종 수정 2023-06-11 14:11

// 컬렉션 삭제 커스텀 훅

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myvisioboardDeleteAPI } from './Api';

const useDeleteCollection = (collection, setCollection, setIndex) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDeleteButtonClick = useCallback(
    async (index) => {
      const itemTitle = collection.title[index];
      const confirmDelete = window.confirm(
        `${itemTitle} 컬렉션을 삭제하시겠습니까?`
      );
      if (!confirmDelete) {
        return;
      }

      setLoading(true); // 삭제 중 로딩 시작

      try {
        const id = collection.id[index]; // 현재 슬라이드 컬렉션 id 저장
        console.log('삭제하려는 현재 컬렉션 id:', id);
        const fetchResult = await myvisioboardDeleteAPI({ navigate, id });

        if (fetchResult && !fetchResult.error) {
          alert(`${itemTitle} 컬렉션이 정상적으로 삭제되었습니다.`);
          console.log('api 통신 결과:', fetchResult); // {error: null} 이면 통신성공

          const remainingItems = {
            img: collection.img.filter((_, idx) => idx !== index),
            title: collection.title.filter((_, idx) => idx !== index),
            id: collection.id.filter((_, idx) => idx !== index),
          };

          // 삭제 후 컬렉션 업데이트
          setCollection(remainingItems);

          // 마지막 슬라이드를 삭제하면 현재 슬라이드=첫번째 인덱스로 이동
          if (index === collection.img.length - 1) {
            setIndex(0);
          }
        }
      } finally {
        setLoading(false); // 삭제 중 로딩 끝
      }
    },
    [collection, setCollection, navigate, setIndex]
  );
  return [handleDeleteButtonClick, loading];
};

export default useDeleteCollection;
