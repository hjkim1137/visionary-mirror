import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MakeBoardName.module.scss';

function MakeBoardNameCompo() {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');

  const handleBoardNameChange = (e) => {
    setBoardName(e.target.value);
  };

  const handleBtnForBoardGrid = () => {
    if (boardName) {
      navigate(`/visionboardgrid?boardName=${encodeURIComponent(boardName)}`);
    } else {
      alert('비전보드 이름을 입력해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContent}>
        <div className={styles.title}>비전보드 이름을 지정해주세요.</div>
        <input
          className={styles.inputName}
          placeholder="나의 비전보드"
          value={boardName}
          onChange={handleBoardNameChange}
        />
      </div>
      <button className={styles.nextBtn} onClick={handleBtnForBoardGrid}>
        다 음
      </button>
    </div>
  );
}

export default MakeBoardNameCompo;
