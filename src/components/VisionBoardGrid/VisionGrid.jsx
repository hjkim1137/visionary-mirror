import styles from './VisionGrid.module.scss';

import React, { useState } from 'react';
import CreateVisionBoardModal from './../CreateVisionBoardModal/CreateVisionBoardModal';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VisionGrid() {
  const navigate = useNavigate();
  const handleForMakeBoardName = () => {
    navigate(`/makeboardname`);
  };
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
    { id: '1', img: null, text: null, isChecked: false },
    { id: '2', img: null, text: null, isChecked: false },
    { id: '3', img: null, text: null, isChecked: false },
    { id: '4', img: null, text: null, isChecked: false },
    { id: 'name', img: null, text: null, isChecked: false },
    { id: '5', img: null, text: null, isChecked: false },
    { id: '6', img: null, text: null, isChecked: false },
    { id: '7', img: null, text: null, isChecked: false },
    { id: '8', img: null, text: null, isChecked: false },
  ]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('1');
  const [uploadedText, setUploadedText] = useState(null);

  const handleGridItemClick = (index) => {
    if (gridItems[index].id !== 'name') {
      setSelectedItemIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleImageAndTextSelect = (imgData, textData) => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems[selectedItemIndex].img = imgData;
      updatedGridItems[selectedItemIndex].text = textData;
      return updatedGridItems;
    });

    setUploadedText(textData);

    setIsModalOpen(false);
  };

  const handleCheckboxClick = (index) => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems[index] = {
        ...updatedGridItems[index],
        isChecked: !updatedGridItems[index].isChecked,
      };
      return updatedGridItems;
    });
  };

  const handleDeleteButtonClick = () => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = prevGridItems.map((item) => {
        if (item.isChecked) {
          return { id: item.id, img: null, text: null, isChecked: false };
        }
        return item;
      });
      return updatedGridItems;
    });
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {gridItems.map((item, index) => {
          const isHidden =
            selectedOption === '2' && [1, 3, 5, 7].includes(index);
          const gridItemClassName = `${styles.gridItem} ${
            isHidden ? styles.hidden : ''
          }`;
          return (
            <div
              key={item.id}
              className={
                item.id === 'name'
                  ? styles.gridItemName
                  : `${gridItemClassName} ${styles.hoverable}`
              }
              onClick={() => handleGridItemClick(index)}
            >
              {item.id !== 'name' && (
                <>
                  {item.img && (
                    <img
                      src={item.img}
                      alt="Selected"
                      style={{ maxWidth: '210px', maxHeight: '210px' }}
                    />
                  )}
                  {item.text && (
                    <div className={styles.gridItemText}>
                      {item.text}
                      {item.id === selectedItemIndex && uploadedText && (
                        <div>{uploadedText}</div>
                      )}
                    </div>
                  )}
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => handleCheckboxClick(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.deleteBtn} onClick={handleDeleteButtonClick}>
          선택삭제
        </button>
        <button className={styles.prevBtn} onClick={handleForMakeBoardName}>
          이전
        </button>
        <button className={styles.completeBtn}>완료</button>
        <select
          className={styles.selectBtn}
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="1">8</option>
          <option value="2">4</option>
        </select>
      </div>
      {isModalOpen && (
        <CreateVisionBoardModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          handleImageAndTextSelect={handleImageAndTextSelect}
        />
      )}
    </div>
  );
}
