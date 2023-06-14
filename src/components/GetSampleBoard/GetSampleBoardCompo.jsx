import React from 'react';
import styles from './GetSampleBoard.module.scss';
import { useNavigate } from 'react-router-dom';
import imageGroup1 from './imageGroup1.png';
import imageGroup2 from './imageGroup2.png';
import imageGroup3 from './imageGroup3.png';

function GetSampleBoardCompo() {
  const navigate = useNavigate();

  const handleBtnForBoardName = () => {
    navigate('/makeboardname');
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <div className={`${styles.imageGroup1} ${styles.blinking1}`}>
            <img
              src={imageGroup1}
              alt="이미지 그룹1"
              className={styles.imgGroupItem}
            ></img>
          </div>

          <div className={`${styles.imageGroup1} ${styles.blinking2}`}>
            <img
              src={imageGroup2}
              alt="이미지 그룹2"
              className={styles.imgGroupItem}
            ></img>
          </div>

          <div className={`${styles.imageGroup1} ${styles.blinking3}`}>
            <img
              src={imageGroup3}
              alt="이미지 그룹3"
              className={styles.imgGroupItem}
            ></img>
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button
            className={styles.visionStartBtn}
            onClick={handleBtnForBoardName}
          >
            비전보드 시작하기
          </button>
        </div>
      </div>
    </>
  );
}

export default GetSampleBoardCompo;
