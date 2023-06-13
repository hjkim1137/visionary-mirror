import { useState, useEffect } from 'react';

// 슬라이드 관련 커스텀 훅
function useCarousel(collection) {
  const [index, setIndex] = useState(0); // 표시되고 있는 슬라이드 인덱스
  const [isSlide, setIsSlide] = useState(false); // 슬라이드 중 여부 체크, 여러번 빠르게 클릭 못하게 하는 역할
  const [x, setX] = useState(0); // 슬라이드 애니메이션 효과를 주기위한 x만큼 이동

  useEffect(() => {
    let autoSlide;

    if (index < collection.img.length - 1) {
      // 마지막 슬라이드 아닐때만 오토슬라이드 작동
      autoSlide = setTimeout(() => {
        increaseClick();
      }, 2500);
    }

    return () => {
      clearTimeout(autoSlide);
    };
  }, [index, collection.img.length]);

  const increaseClick = async () => {
    //오른쪽 버튼
    if (isSlide || index === collection.img.length - 1) {
      return;
    }
    setX(-56);
    setIsSlide(true);

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setX(0);
      setIsSlide(false);
    }, 500);
  };

  const decreaseClick = async () => {
    //왼쪽 버튼
    if (isSlide || index === 0) {
      return;
    }
    setX(+56);
    setIsSlide(true);

    setTimeout(() => {
      setIndex((prev) => prev - 1);
      setX(0);
      setIsSlide(false);
    }, 500);
  };

  // 전전슬라이드, 전슬라이드, 다음슬라이드, 다다음슬라이드
  const morePrevImg =
    (index + collection.img.length - 2) % collection.img.length;
  const PrevImg = (index + collection.img.length - 1) % collection.img.length;
  const NextImg = (index + 1) % collection.img.length;
  const moreNextImg = (index + 2) % collection.img.length;

  return {
    setIndex,
    index,
    increaseClick,
    decreaseClick,
    x,
    morePrevImg,
    PrevImg,
    NextImg,
    moreNextImg,
  };
}

export default useCarousel;
