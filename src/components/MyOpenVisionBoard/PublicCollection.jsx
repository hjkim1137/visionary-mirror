import { useState } from 'react';

const usePublicCollection = (setCollection, collection) => {
  const publicAPI = 'http://localhost:8888/publiccollection';

  const [loading, setLoading] = useState(false);
  const [publicCollection, setPublicCollection] = useState();

  const handleBtnForPublicOpen = async (id, title, img, collection) => {
    setLoading(true);

    // 이미 공개된 컬렉션이 있는지 확인하고, 있다면 알림 메시지를 띄우고 함수를 종료합니다.
    if (publicCollection) {
      alert(
        '이미 공개된 컬렉션이 있습니다. 먼저 취소하고 다시 공개 설정해주세요'
      );
      setLoading(false);
      return;
    }

    // 공개 컬렉션을 설정할 것인지 묻는 확인 메시지를 띄웁니다. 사용자가 취소를 누르면 함수를 종료합니다.
    if (
      !window.confirm(`${title} 컬렉션을 공개 컬렉션으로 설정하시겠습니까?`)
    ) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(publicAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          img,
        }),
      });

      if (!response.ok) {
        throw new Error('요청 처리 실패');
      }

      const publicCollection = await response.json(); // 서버로부터 반환된 새로운 공개 컬렉션 정보를 받아옵니다.

      // 공개 컬렉션을 설정하려는 컬렉션을 제외한 나머지 컬렉션을 state에 저장합니다.
      if (Array.isArray(collection)) {
        const updatedCollection = collection.filter((item) => item.id !== id);
        setCollection(updatedCollection);
      } else {
        console.error('Invalid collection: ', collection);
      }
      setPublicCollection(publicCollection);

      // 공개 컬렉션의 정보를 버튼 밑에 표시합니다.
      const collectionInfoDiv = document.getElementById('collectionInfo');
      if (collectionInfoDiv) {
        collectionInfoDiv.innerText = publicCollection.title;
      }
    } catch (error) {
      console.error('공개 컬렉션 등록에 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBtnForPublicClose = async () => {
    setLoading(true);

    try {
      // publicCollection이 없다면 (즉, 공개된 컬렉션이 없다면) 함수를 종료합니다.
      if (!publicCollection) return;

      if (
        !window.confirm(
          `${publicCollection.title} 컬렉션을 비공개로 설정하시겠습니까?`
        )
      ) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${publicAPI}/${publicCollection.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('요청 처리 실패');
      }

      // 비공개 처리가 성공하면 publicCollectionId를 초기화합니다.
      setPublicCollection(null);

      // 공개 컬렉션의 정보를 삭제합니다.
      const collectionInfoDiv = document.getElementById('collectionInfo');
      if (collectionInfoDiv) {
        collectionInfoDiv.innerText = '';
      }
    } catch (error) {
      console.error('공개 컬렉션 삭제에 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  return [handleBtnForPublicOpen, handleBtnForPublicClose, loading];
};

export default usePublicCollection;
