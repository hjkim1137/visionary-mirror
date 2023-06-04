import styles from './VisionGrid.module.scss';

import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
import CreateVisionBoardModal from './../CreateVisionBoardModal/CreateVisionBoardModal';

export default function VisionGrid() {
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const boardName = params.get('boardName');

  //   if (!boardName) {
  //     alert('비전보드 이름을 먼저 입력해주세요.');
  //     navigate('/makeboardname');
  //   }
  // }, [navigate, location]);

  const [gridItems, setGridItems] = useState([
    { id: '1', img: null, isChecked: false },
    { id: '2', img: null, isChecked: false },
    { id: '3', img: null, isChecked: false },
    { id: '4', img: null, isChecked: false },
    { id: 'name', img: null, isChecked: false },
    { id: '5', img: null, isChecked: false },
    { id: '6', img: null, isChecked: false },
    { id: '7', img: null, isChecked: false },
    { id: '8', img: null, isChecked: false },
  ]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGridItemClick = (index) => {
    if (gridItems[index].id !== 'name') {
      setSelectedItemIndex(index);
      setIsModalOpen(true);
    }
  };
  const handleImageSelect = (imgData) => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems[selectedItemIndex].img = imgData;
      return updatedGridItems;
    });
    setIsModalOpen(false);
  };

  const handleCheckboxClick = (index) => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems[index].isChecked = !updatedGridItems[index].isChecked;
      return updatedGridItems;
    });
  };

  const handleDeleteButtonClick = () => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = prevGridItems.map((item) => {
        if (item.isChecked) {
          return { id: item.id, img: null, isChecked: false };
        }
        return item;
      });
      return updatedGridItems;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {gridItems.map((item, index) => (
          <div
            key={item.id}
            className={
              item.id === 'name' ? styles.gridItemName : styles.gridItem
            }
            onClick={() => handleGridItemClick(index)}
          >
            {item.id !== 'name' && item.img && (
              <img
                src={item.img}
                alt="Selected"
                style={{ maxWidth: '210px', maxHeight: '210px' }}
              />
            )}
            {item.id !== 'name' && (
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => handleCheckboxClick(index)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.deleteBtn} onClick={handleDeleteButtonClick}>
          선택삭제
        </button>
        <button className={styles.prevBtn}>이전</button>
        <button className={styles.nextBtn}>다음</button>
      </div>
      {isModalOpen && (
        <CreateVisionBoardModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          handleImageSelect={handleImageSelect}
        />
      )}
    </div>
  );
}
