import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './makeBoardName.module.scss';

function MakeBoardName() {
  const navigate = useNavigate();

  const handleBtnForBoardImg = () => {
    const boardName = "";

    if(boardName) {
      navigate(`/visionboardgrid`);
    } else {
      alert("보드 이름을 입력해주세요.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContent}>
        <div>비전보드 이름을 지정해주세요.</div>
        <input className={styles.inputName}></input>
      </div>
      <button 
        className={styles.nextBtn}
        onClick={handleBtnForBoardImg}>다음</button>
    </div>
  );
}

export default MakeBoardName;

