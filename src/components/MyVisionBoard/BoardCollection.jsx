//최종 수정 시간 : 2023-06-11 14:14

import { useState, useEffect } from 'react';
import styles from './BoardCollection.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useDeleteCollection from './DeleteCollection';
import useCarousel from './Carousel';
import { myvisioboardGetAPI } from './Api';

function BoardCollection() {
  const [collection, setCollection] = useState({
    img: [],
    title: [],
    id: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchResult = await myvisioboardGetAPI({ navigate });

      if (fetchResult && !fetchResult.error) {
        console.log('api 통신 결과:', fetchResult); // {error: null} 이면 통신성공

        // items는 객체를 포함하는 배열 시작 ---
        const items = fetchResult.data;
        console.log('get으로 받아온 datas들의 data(array)', items);

        const titles = items.map((item) => item.title);
        const visionboardIds = items.map((item) => item.visionboardId);
        // const imgPaths = items.map((item) => item.imagePath);

        // 이미지 파일 경로를 웹 서버의 URL로 바꾸기
        const imgPaths = items.map((item) => {
          const visionaryIp = process.env.REACT_APP_VISIONARY_IP; // ip 주소 불러오기
          const imagePath = item.imagePath.replace(
            '/home/elice/projects/visionary', // 전체 경로에서 이 부분 제거
            visionaryIp
          );
          console.log('visionaryIp', visionaryIp);
          return imagePath;
        });

        setCollection({
          title: titles,
          id: visionboardIds,
          img: imgPaths,
        });
        // items 객체를 포함하는 배열 끝 ---
      }
    };
    fetchData();
  }, []);

  // console.log('컬렉션 정보:', collection);

  // 컬렉션 상세보기 페이지 넘어가기
  const handleBtnForBoardDetail = (id) => {
    navigate(`/myvisionboardgrid/${id}`);
    console.log('상세보기클릭', id);
  };

  // useCarousel 커스텀훅
  // useDeleteCollection 커스텀훅 보다 순서상 먼저 선언되어야 함
  const {
    setIndex,
    index,
    increaseClick,
    decreaseClick,
    x,
    morePrevImg,
    PrevImg,
    NextImg,
    moreNextImg,
  } = useCarousel(collection);

  // useDeleteCollection 커스텀훅 클릭 핸들러
  const [handleDeleteButtonClick, loading] = useDeleteCollection(
    collection,
    setCollection,
    setIndex
  );

  // 리턴
  return (
    <div className={styles.wrapper}>
      {/* 보유한 컬렉션 없으면 문구 제외 모든 기능 숨김 */}
      {collection.img.length === 0 ? (
        <div className={styles.noCollection}>
          보유한 컬렉션이 없습니다. 비전보드를 만들어보세요!
        </div>
      ) : (
        <>
          {/* 삭제중일 때 오버레이 */}
          {loading && (
            <div className={styles.overlay}>
              <p className={styles.loadingText}>삭제 중...</p>
            </div>
          )}
          {/* 왼쪽 버튼 */}
          <button
            className={styles.leftButton}
            onClick={decreaseClick}
            // 첫번째 페이지 도달 시 버튼 숨김
            style={{ display: index === 0 ? 'none' : 'block' }}
          >
            <FiChevronLeft />
          </button>

          {/* 오른쪽 버튼 */}
          <button
            className={styles.rightButton}
            onClick={increaseClick}
            // 마지막 페이지 도달 시 버튼 숨김
            style={{
              display: index === collection.img.length - 1 ? 'none' : 'block',
            }}
          >
            <FiChevronRight />
          </button>

          {/* 가로 정렬 등 전체 스타일 시작  */}
          <div className={styles.row} key={index}>
            {/* 전전 슬라이드에 적용 */}
            {collection.img.length > 2 && collection.img[morePrevImg] && (
              <div className={styles.container}>
                <img
                  className={styles.priviewImg}
                  src={collection.img[morePrevImg]}
                ></img>
              </div>
            )}

            {/* 전 슬라이드에 적용 */}
            {collection.img.length > 1 && collection.img[PrevImg] && (
              <div className={styles.container}>
                <img
                  className={styles.priviewImg}
                  src={collection.img[PrevImg]}
                ></img>
              </div>
            )}

            {/* 현재 슬라이드 시작 */}
            <div className={styles.imgWrapper}>
              <img
                className={styles.img}
                src={collection.img[index]}
                alt="현재 슬라이드"
              ></img>
              {/* 이미지 설명 박스 */}
              <div className={styles.imgDes}>
                <div className={styles.title}>{collection.title[index]}</div>
              </div>
            </div>
            {/* 현재 슬라이드  끝 */}

            {/* 다음 슬라이드에 적용 */}
            {collection.img.length > 1 && collection.img[NextImg] && (
              <div className={styles.container}>
                <img
                  className={styles.priviewImg}
                  src={collection.img[NextImg]}
                ></img>
              </div>
            )}

            {/* 다다음 슬라이드에 적용 */}
            {collection.img.length > 2 && collection.img[moreNextImg] && (
              <div className={styles.container}>
                <img
                  className={styles.priviewImg}
                  src={collection.img[moreNextImg]}
                ></img>
              </div>
            )}
          </div>
          {/* 가로 정렬 등 전체 스타일 끝  */}

          {/* 현재 슬라이드 위치 표시 */}
          <div className={styles.dotWrapper}>
            {collection.img.map((_, idx) => (
              <div
                key={idx}
                className={
                  styles.dot + (idx === index ? ' ' + styles.active : '')
                }
              ></div>
            ))}
          </div>

          {/* 버튼박스 */}
          <div className={styles.buttonBox}>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteButtonClick(index)}
            >
              컬렉션 삭제
            </button>

            <button
              className={styles.detailButton}
              onClick={() => handleBtnForBoardDetail(collection.id[index])}
            >
              컬렉션 상세
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BoardCollection;
