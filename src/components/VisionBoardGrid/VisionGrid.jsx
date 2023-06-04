import styles from './VisionGrid.module.scss';

import React, { useState, useEffect } from 'react';
import CreateVisionBoardModal from './../CreateVisionBoardModal/CreateVisionBoardModal';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VisionGrid() {
  const navigate = useNavigate();
  const handleForMakeBoardName = () => {
    navigate('/makeboardname');
  };
  const location = useLocation();
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryBoardName = params.get('boardName');

    if (!queryBoardName) {
      alert('비전보드 이름을 먼저 입력해주세요.');
      navigate('/makeboardname');
    } else {
      setBoardName(queryBoardName);
    }
    console.log(queryBoardName);
  }, [navigate, location]);

  const [gridItems, setGridItems] = useState([
    { id: '1', img: null, text: null, isChecked: false },
    { id: '2', img: null, text: null, isChecked: false },
    { id: '3', img: null, text: null, isChecked: false },
    { id: '4', img: null, text: null, isChecked: false },
    { id: 'name' },
    { id: '5', img: null, text: null, isChecked: false },
    { id: '6', img: null, text: null, isChecked: false },
    { id: '7', img: null, text: null, isChecked: false },
    { id: '8', img: null, text: null, isChecked: false },
  ]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('1');
  const [uploadedText, setUploadedText] = useState(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  useEffect(() => {
    checkUploadComplete();
  }, [gridItems, selectedOption]);

  const checkUploadComplete = () => {
    let uploadCount = 0;
    if (selectedOption === '1') {
      for (const item of gridItems) {
        if (item.img && item.text) {
          uploadCount++;
        }
      }
    } else if (selectedOption === '2') {
      for (let i = 0; i < gridItems.length; i += 2) {
        if (gridItems[i].img && gridItems[i].text) {
          uploadCount++;
        }
      }
    }

    setIsUploadComplete(uploadCount === getRequiredUploadCount());
  };

  const getRequiredUploadCount = () => {
    return selectedOption === '1' ? 8 : 4;
  };

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
    const newSelectedOption = event.target.value;
    setSelectedOption(newSelectedOption);

    if (newSelectedOption === '2') {
      setGridItems((prevGridItems) => {
        const updatedGridItems = [...prevGridItems];

        // 8개 업로드에서 4개 업로드로 변경될 때, 1, 3, 5, 7번째 항목 초기화
        updatedGridItems[1].img = null;
        updatedGridItems[1].text = null;
        updatedGridItems[3].img = null;
        updatedGridItems[3].text = null;
        updatedGridItems[5].img = null;
        updatedGridItems[5].text = null;
        updatedGridItems[7].img = null;
        updatedGridItems[7].text = null;

        return updatedGridItems;
      });
    }
  };

  const handleCompleteButtonClick = () => {
    if (isUploadComplete) {
      // 완료 버튼을 누른 후의 동작을 수행
    } else {
      alert('이미지와 문구를 모두 업로드해야 합니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {gridItems.map((item, index) => {
          const isHidden =
            selectedOption === '2' && [1, 3, 5, 7].includes(index);
          const gridItemClassName = `${styles.gridItem} ${
            isHidden ? styles.hidden : ''
          } ${item.img ? styles.hiddenBorder : ''}`;

          if (item.id === 'name') {
            return (
              <div
                key={item.id}
                onClick={() => handleGridItemClick(index)}
                className={styles.gridItemName}
              >
                <div>
                  {item.text || boardName}
                  {item.id === selectedItemIndex && uploadedText && (
                    <div>{uploadedText}</div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div
              key={item.id}
              className={
                item.id === 'name'
                  ? ''
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
        <button
          className={styles.completeBtn}
          onClick={handleCompleteButtonClick}
        >
          완료
        </button>
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
