// branch: feat/#3/get-sample-board

import React from 'react';
import styles from '../components/GetSampleBoard/GetSampleBoard.module.scss';
import { useNavigate } from 'react-router-dom';
import imageGroup1 from '../components/GetSampleBoard/imageGroup1.png';
import imageGroup2 from '../components/GetSampleBoard/imageGroup2.png';
import imageGroup3 from '../components/GetSampleBoard/imageGroup3.png';

function GetSampleBoard() {
  const navigate = useNavigate();

  const handleBtnForBoardName = () => {
    navigate('/makeboardname');
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <div className={styles.imageGroup1}>
            <img
              src={imageGroup1}
              alt="이미지 그룹1"
              className={styles.imgGroupItem}
            ></img>
          </div>

          <div className={styles.imageGroup2}>
            <img
              src={imageGroup2}
              alt="이미지 그룹2"
              className={styles.imgGroupItem}
            ></img>
          </div>

          <div className={styles.imageGroup3}>
            <img
              src={imageGroup3}
              alt="이미지 그룹3"
              className={styles.imgGroupItem}
            ></img>
          </div>
        </div>
      </div>

      <div className={styles.buttonBox}>
        <button
          className={styles.visionStartBtn}
          onClick={handleBtnForBoardName}
        >
          Create VisionBoard
        </button>
      </div>
    </>
  );
}

export default GetSampleBoard;
