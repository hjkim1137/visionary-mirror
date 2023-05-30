import { useState, useRef, useEffect } from "react";
import styles from "./boardCollection.module.scss";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

const collectionImg = [
  "https://static.wanted.co.kr/images/banners/1489/312a0c29.jpg",
  "https://static.wanted.co.kr/images/banners/1486/fba2df30.jpg",
  "https://static.wanted.co.kr/images/banners/1468/3df61cbc.jpg",
  "https://static.wanted.co.kr/images/banners/1490/0b775035.jpg",
  "https://static.wanted.co.kr/images/banners/1484/b2853456.jpg",
  "https://static.wanted.co.kr/images/banners/1460/619f3af7.jpg",
  "https://static.wanted.co.kr/images/banners/1473/41f7b36e.jpg",
  "https://static.wanted.co.kr/images/banners/1487/0d36f0b5.jpg",
  "https://static.wanted.co.kr/images/banners/1488/baa54448.jpg",
];

const collectionTitle = [
  "컬렉션1",
  "컬렉션2",
  "컬렉션3",
  "컬렉션4",
  "컬렉션5",
  "컬렉션6",
  "컬렉션7",
  "컬렉션8",
  "컬렉션9",
];

function BoardCollection() {
  //슬라이드
  const slideRef = useRef(null);
  const [index, setIndex] = useState(0); // 슬라이드 인덱스
  const [isSlide, setIsSlide] = useState(false); // 슬라이드 중인지 체크해줍니다. 슬라이드 중에 여러번 빠르게 클릭 못하게 하는 역할
  const [x, setX] = useState(0); // 슬라이드 애니메이션 효과를 주기위한 x만큼 이동

  //드래그로 슬라이드 넘기기
  const [isClick, setIsClick] = useState(false); // 드래그를 시작하는지 체크해줍니다.
  const [mouseDownClientX, setMouseDownClientX] = useState(0); // 마우스를 클릭한 지점의 x 좌료를 저장합니다
  const [mouseUpClientX, setMouseUpClientX] = useState(0); // 마우스를 땐 지점의 x 좌표를 저장합니다.

  //반응형 사이트
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 반응형 사이트 상태관리

  //오른쪽 버튼 함수
  const increaseClick = async () => {
    if (isSlide) {
      return;
    }
    setX(-56);
    setIsSlide(true);

    await setTimeout(() => {
      setIndex((prev) => (prev === 8 ? 0 : prev + 1));
      setX(0);
      setIsSlide(false);
    }, 500);
    //setIndex((prev) => (prev === 7 ? 0 : prev + 1));
  };

  //왼쪽 버튼 함수
  const decreaseClick = async () => {
    if (isSlide) {
      return;
    }
    setX(+56);
    setIsSlide(true);

    await setTimeout(() => {
      setIndex((prev) => (prev === 0 ? 8 : prev - 1));
      setX(0);
      setIsSlide(false);
    }, 500);
  };

  // 슬라이드 인덱스 및 개수(이미지 총 9장, 인덱스 0~8)
  const morePrevImg = index === 1 ? 8 : index === 0 ? 7 : index - 2;
  const PrevImg = index === 0 ? 8 : index - 1; // 다음 슬라이드 이동
  const NextImg = index === 8 ? 0 : index + 1; // 이전 슬라이드 이동
  const moreNextImg = index === 8 ? 1 : index === 7 ? 0 : index + 2;
  //console.log(slideRef.current);
  console.log(index);

  const onMouseDown = (event) => {
    setIsClick(true);
    setMouseDownClientX(event.pageX);
    console.log(slideRef);
  };

  const onMouseLeave = (event) => {
    setIsClick(false);
  };

  const onMouseUp = (event) => {
    setIsClick(false);
    const imgX = mouseDownClientX - mouseUpClientX;
    // console.log(imgX);
    if (imgX < -100) {
      slideRef.current.style.transform = `translateX(${imgX}px)`;
      increaseClick();
    } else if (imgX > 100) {
      slideRef.current.style.transform = `translateX(${imgX}px)`;
      decreaseClick();
    }
  };

  const onMouseMove = (event) => {
    if (!isClick) return;
    event.preventDefault();
    setMouseUpClientX(event.pageX);
    const imgX = mouseDownClientX - mouseUpClientX;
    if (Math.abs(imgX) > 100) {
      // slideRef.current.style.transform = `translateX(${imgX}px)`;
    }
  };

  const resizeWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  useEffect(() => {
    const autoPage = setTimeout(() => {
      setX(-56);
      setIsSlide(true);
      setTimeout(() => {
        setIndex((prev) => (prev === 8 ? 0 : prev + 1));
        setX(0);
        setIsSlide(false);
      }, 500);
    }, 5000);
    return () => {
      clearTimeout(autoPage);
    };
  }, [index, isClick]);
  console.log(`브라우저 사이즈 : ${windowWidth}`);

  // 리턴
  return (
    <div className={styles.wrapper}>
      {/* 왼쪽 버튼 */}
      <button
        className={styles.leftButton}
        style={{
          left:
            windowWidth > 1800
              ? `18.5%`
              : windowWidth > 1500
              ? `10%`
              : windowWidth > 1300
              ? `5%`
              : `0%`,
          visibility: windowWidth < 1335 ? "hidden" : "visible",
        }}
        onClick={decreaseClick}
      >
        <FiChevronLeft />
      </button>

      <div
        className={styles.row}
        key={index}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        ref={slideRef}
        style={{
          transform: `translateX(${x}vw)`,
        }}
      >
        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            style={{
              opacity: 0.5,
              width: windowWidth > 1200 ? null : `80vw`,
              height:
                windowWidth > 1200
                  ? null
                  : windowWidth < 770
                  ? "185px"
                  : "250px",
            }}
            src={collectionImg[morePrevImg]}
          ></img>
        </div>

        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            style={{
              opacity: 0.5,
              width: windowWidth > 1200 ? null : `80vw`,
              height:
                windowWidth > 1200
                  ? null
                  : windowWidth < 770
                  ? "185px"
                  : "250px",
            }}
            src={collectionImg[PrevImg]}
          ></img>
        </div>

        {/* 반응형 스타일 시작  */}
        <div className={styles.imgWrapper}>
          <img
            className={styles.img}
            style={{
              opacity: 1,
              width: windowWidth > 1200 ? null : `80vw`,
              height:
                windowWidth > 1200
                  ? null
                  : windowWidth < 770
                  ? "185px"
                  : "250px",
            }}
            src={collectionImg[index]}
          ></img>

          {!isSlide && windowWidth > 1200 ? (
            <div className={styles.imgDes}>
              <div className={styles.title}>{collectionTitle[index]}</div>
              <div className={styles.linkSpan}>바로가기</div>
            </div>
          ) : null}

          {!isSlide && windowWidth <= 1200 ? (
            <div className={styles.miniWrapper}>
              <div className={styles.miniTitle}>{collectionTitle[index]}</div>
              <div className={styles.linkSpan}>바로가기</div>
            </div>
          ) : null}
        </div>

        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            style={{
              opacity: 0.5,
              width: windowWidth > 1200 ? null : `80vw`,
              height:
                windowWidth > 1200
                  ? null
                  : windowWidth < 770
                  ? "185px"
                  : "250px",
            }}
            src={collectionImg[NextImg]}
          ></img>
        </div>

        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            style={{
              opacity: 0.5,
              width: windowWidth > 1200 ? null : `80vw`,
              height:
                windowWidth > 1200
                  ? null
                  : windowWidth < 770
                  ? "185px"
                  : "250px",
            }}
            src={collectionImg[moreNextImg]}
          ></img>
        </div>
        {/* 반응형 스타일 끝  */}
      </div>

      {/* 오른쪽 버튼 */}
      <button
        className={styles.rightButton}
        style={{
          right:
            windowWidth > 1800
              ? `18.5%`
              : windowWidth > 1500
              ? `10%`
              : windowWidth > 1200
              ? `5%`
              : `0%`,
          visibility: windowWidth < 1335 ? "hidden" : "visible",
        }}
        onClick={increaseClick}
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default BoardCollection;
