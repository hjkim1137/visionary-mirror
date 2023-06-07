import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';

const publicAPI = 'http://localhost:8888/publiccollection';

function HomeCompo() {
  const [publicCollection, setPublicCollection] = useState({});

  // 컬렉션 상세보기 페이지 넘어가기
  const navigate = useNavigate();
  const handleBtnForBoardDetail = (id) => {
    navigate(`/myvisionboardgrid/${id}`);
    console.log('상세보기클릭', id);
  };

  // public collection db에 저장한 정보를 get으로 불러오는 기능
  useEffect(() => {
    try {
      fetch(publicAPI)
        .then((response) => {
          if (!response.ok) {
            throw new Error('네트워크 응답이 정상적이지 않습니다');
          }
          return response.json();
        })
        .then((data) => {
          // console.log('받아온 데이터', data[0]);
          // console.log('publiccollection_id: ', data[0].id);
          // console.log('publiccollection_title: ', data[0].title);
          // console.log('publiccollection_img: ', data[0].img);
          setPublicCollection(data[0]);
          console.log('업데이트:', setPublicCollection);
        });
    } catch (err) {
      console.error('비동기 처리 중 오류가 발생했습니다:', err);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.collectionTitle}>{publicCollection.title}</div>
      <img
        src={publicCollection.img}
        className={styles.img}
        alt={publicCollection.title}
      />
      <button
        className={styles.detailButton}
        onClick={() => handleBtnForBoardDetail(publicCollection.id)}
      >
        컬렉션 구경가기
      </button>
    </div>
  );
}

export default HomeCompo;
