// branch: feat/#3/get-sample-board

import React from "react";
import styles from "./getSampleBoard.module.scss";
import { useNavigate } from "react-router-dom";

function GetSampleBoard() {
  const navigate = useNavigate();

  const handleBtnForBoardName = () => {
    navigate("/makeboardname");
  };

  return (
    <div className={styles.container}>
      <div className={styles.samplePage}>예시 비전보드 샘플들</div>
      <button className={styles.visionStartBtn} onClick={handleBtnForBoardName}>
        비전보드 시작하기
      </button>
    </div>
  );
}

export default GetSampleBoard;
