import React from 'react';
import styles from './MyVisionGrid.module.scss';
import { ImWrench, ImCancelCircle } from 'react-icons/im';

function MyVisionGrid() {
  const gridItems = ['1', '2', '3', '4', 'MY', '5', '6', '7', '8'];

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {gridItems.map((item, index) => (
          <div
            key={index}
            className={index === 4 ? styles.gridItemName : styles.gridItem}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="gridContainer1"></div>
      <div className={styles.btnContainer}>
        <button className={styles.listBtn}>비전보드 목록</button>
        <ImWrench className={styles.fixBtn} />
        <ImCancelCircle className={styles.deleteBtn} />
      </div>
    </div>
  );
}

export default MyVisionGrid;
