import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./makeBoardName.module.scss";
import { FiFastForward } from "react-icons/fi";

function MakeBoardName() {
  const navigate = useNavigate();

  const handleBtnForBoardImg = () => {
    const boardName = "";

    if (boardName) {
      navigate(`/visionboardgrid`);
    } else {
      alert("비전보드 이름을 입력해주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContent}>
        <div className={styles.title}>비전보드 이름을 지정해주세요.</div>
        <input className={styles.inputName} placeholder="나의 비전보드"></input>
      </div>
      <button className={styles.nextBtn} onClick={handleBtnForBoardImg}>
        다음
      </button>
    </div>
  );
}

export default MakeBoardName;
