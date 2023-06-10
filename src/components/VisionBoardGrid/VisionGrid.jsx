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
    const requiredUploadCount = getRequiredUploadCount();
    let count = 0;

    for (const item of gridItems) {
      if (item.img && item.text) {
        count++;
      }
    }

    console.log('Upload Count:', count);
    setUploadCount(count);
    setIsUploadComplete(count === requiredUploadCount);
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
      const selectedItem = updatedGridItems[selectedItemIndex];
      selectedItem.img = imgData;
      selectedItem.text = textData;
      selectedItem.isChecked = false;
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

  const handleOptionChange = (e) => {
    const newSelectedOption = e.target.value;

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

  const handleCompleteButtonClick = async (e) => {
    e.preventDefault();
    if (selectedOption === '2') {
      if (uploadCount < 4) {
        alert('4개의 텍스트와 이미지를 업로드해야 합니다.');
        return;
      }
    } else if (selectedOption === '1') {
      if (uploadCount < 8) {
        alert('8개의 텍스트와 이미지를 업로드해야 합니다.');
        return;
      }
    }

    const formData = new FormData();
    let imageIndex = 1;
    let descriptionIndex = 1;

    for (const item of gridItems) {
      if (item.img) {
        formData.append(`image${imageIndex}`, item.img);
        imageIndex++;
      }
      if (item.text) {
        formData.append(`description${descriptionIndex}`, item.text);
        descriptionIndex++;
      }
    }

    formData.append('title', boardName);

    try {
      const response = await fetch('/api/v1/visionboard', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // Set Content-Type header with charset
        },
      });

      if (response.ok) {
        console.log('Images and descriptions uploaded successfully');
        console.log(response);
      } else if (response.status === 401) {
        console.log('401: 인증되지 않음');
        localStorage.removeItem('isLogin');
        navigate('/');
      } else if (response.status === 500) {
        console.log('500: 내부 서버 오류');
      } else {
        console.log('기타 상태');
        alert('오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('에러:', error);
    }
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
        <form onSubmit={handleCompleteButtonClick}>
          <button className={styles.completeBtn} type="submit">
            완료
          </button>
          <input type="hidden" name="boardName" value={boardName} />
          {gridItems.map((item, index) => (
            <>
              {item.img && (
                <input
                  type="hidden"
                  name={`image${index + 1}`}
                  value={item.img}
                />
              )}
              {item.text && (
                <input
                  type="hidden"
                  name={`description${index + 1}`}
                  value={item.text}
                />
              )}
            </>
          ))}
        </form>
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
