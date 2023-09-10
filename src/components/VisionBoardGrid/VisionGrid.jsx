import styles from './VisionGrid.module.scss';

import React, { useState, useEffect } from 'react';
import CreateVisionBoardModal from './../VisionBoardModal/CreateVisionBoardModal';
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
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    checkUploadComplete();
  }, [gridItems, selectedOption]);

  const checkUploadComplete = () => {
    if (selectedOption === '1') {
      let count = 0;
      for (const item of gridItems) {
        if (item.img && item.text) {
          count++;
        }
      }
      console.log('Upload Count:', count);
      setUploadCount(count);
    } else if (selectedOption === '2') {
      let count = 0;
      for (const item of gridItems) {
        if (item.img && item.text) {
          count++;
        }
      }
      console.log('Upload Count:', count);
      setUploadCount(count);
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

    if (newSelectedOption === '2') {
      const skippedGridIds = ['name', '2', '4', '5', '7'];
      const hasUploadedImages = gridItems
        .filter((item) => !skippedGridIds.includes(item.id))
        .some((item) => item.img !== null);

      if (hasUploadedImages) {
        const confirmed = window.confirm(
          '기존에 업로드한 이미지는 삭제됩니다. 변경하시겠습니까?'
        );
        if (!confirmed) {
          return;
        }
      }

      setGridItems((prevGridItems) => {
        const updatedGridItems = [...prevGridItems];

        for (let i = 0; i < updatedGridItems.length; i += 2) {
          if (!skippedGridIds.includes(updatedGridItems[i].id)) {
            updatedGridItems[i].img = null;
            updatedGridItems[i].text = null;
            updatedGridItems[i].isChecked = false;
          }
        }

        return updatedGridItems;
      });
    }

    setSelectedOption(newSelectedOption);
  };

  const handleCompleteButtonClick = () => {
    if (selectedOption === '2') {
      if (uploadCount < 4) {
        alert('4개의 문구와 이미지를 업로드 해야합니다.');
        return;
      }
    } else if (selectedOption === '1') {
      if (uploadCount < 8) {
        alert('8개의 문구와 이미지를 업로드 해야합니다.');
        return;
      }
    }

    const formData = new FormData();
    let gridImgIndex = 1;
    let gridTextIndex = 1;

    for (const item of gridItems) {
      if (item.img) {
        formData.append(`image${gridImgIndex}`, item.img);
        gridImgIndex++;
      }
      if (item.text) {
        formData.append(`description${gridTextIndex}`, item.text);
        gridTextIndex++;
      }
    }

    formData.append('title', boardName);

    for (const key of formData.keys()) {
      console.log(key);
    }

    for (const value of formData.values()) {
      console.log(value);
    }

    console.log('Form Data', formData);

    fetch('/api/v1/visionboard', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('200: OK');
          console.log(response);
        } else if (response.status === 401) {
          console.log('401: 잘못된 요청, 요청 값 오류');
          // 401 오류 처리 부분 작성
        } else if (response.status === 500) {
          console.log('500: 내부 서버 오류');
          // 500 오류 처리 부분 작성
        } else {
          // 필요한 경우 다른 상태 코드 처리
        }
      })
      .catch((error) => {
        console.error('에러:', error);
        // 에러 처리 부분 작성
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {gridItems.map((item, index) => {
          const isHidden =
            selectedOption === '2' && [0, 2, 6, 8].includes(index);
          const gridItemClassName = `${styles.gridItem} ${
            isHidden ? styles.hidden : ''
          } ${item.img ? styles.hiddenBorder : ''}`;
          if (item.id === 'name') {
            return (
              <div className={styles.gridBoardName}>
                <div>{boardName}</div>
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
                  {item.img && <img src={item.img} alt="Selected" />}
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
        <div className={styles.selectContiner}>
          <p>이미지 개수</p>
          <select
            className={styles.selectBtn}
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="1">8</option>
            <option value="2">4</option>
          </select>
        </div>
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
