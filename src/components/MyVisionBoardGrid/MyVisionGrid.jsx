import React, { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import EditVisionBoardModal from '../VisionBoardModal/EditVisionBoardModal'
import styles from '../VisionBoardGrid/VisionGrid.module.scss';

import { getApi, putApi, deleteApi } from './Api';
import { initGridItmes } from './InitGridItems'

export default function MyVisionGrid() {
    const navigate = useNavigate();
    const location = useLocation();

    const id = location.pathname.split('/')[2];

    // 목록으로 돌아가기 버튼
    const handleBackToMyCollection = useCallback(() => {
        navigate('/myvisionboard/list')
    }, [])
    // 비전보드 삭제 버튼
    const handleCollectionDelete = useCallback(() => {
        if (window.confirm('현재 열람중인 비전보드를 삭제하시겠습니까?')) {
            deleteApi(id);
            handleBackToMyCollection();
        }
    }, [])
    // 내 비전보드 페이지 접속시 데이터 패칭
    useEffect(() => {
        const fetchingData = async () => {
            try {
                const result = await getApi(id);
                if (result) {
                    // Array.from(result)
                    const fetchedData = result.data.visionboardcontentSequence;
                    const reunion = [
                        { id: fetchedData[0].sequence, img: fetchedData[0].imagePath, text: fetchedData[0].description, isChecked: false },
                        { id: fetchedData[1].sequence, img: fetchedData[1].imagePath, text: fetchedData[1].description, isChecked: false },
                        { id: fetchedData[2].sequence, img: fetchedData[2].imagePath, text: fetchedData[2].description, isChecked: false },
                        { id: fetchedData[3].sequence, img: fetchedData[3].imagePath, text: fetchedData[3].description, isChecked: false },
                        { id: 'name', text : result.data.title },
                        { id: fetchedData[4].sequence, img: fetchedData[4].imagePath, text: fetchedData[4].description, isChecked: false },
                        { id: fetchedData[5].sequence, img: fetchedData[5].imagePath, text: fetchedData[5].description, isChecked: false },
                        { id: fetchedData[6].sequence, img: fetchedData[6].imagePath, text: fetchedData[6].description, isChecked: false },
                        { id: fetchedData[7].sequence, img: fetchedData[7].imagePath, text: fetchedData[7].description, isChecked: false },
                    ]
                    setGridItems(reunion)
                    console.log(`받아온 데이터 확인`, fetchedData);
                    console.log('fetchedData[0].sequence :', fetchedData[0].sequence)
                    console.log('fetchedData[0].imagePath :', fetchedData[0].imagePath)
                    console.log('fetchedData[0].description :', fetchedData[0].description)
                } else {
                    throw new Error('유저 비전 보드 그리드 가져오기 실패')
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchingData();
    }, []);

    const [gridItems, setGridItems] = useState([])
    console.log('패치 외부 gridItems 확인 :', gridItems)
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('1');
    const [uploadedText, setUploadedText] = useState(null);
    const [readOnly, setReadOnly] = useState(true);

    const handleGridItemClick = (index) => {
        if (gridItems[index].id !== 'name') {
            setSelectedItemIndex(index);
            if (readOnly === true) {
                setIsModalOpen(false)
            } else {
                setIsModalOpen(true);
            }
            return;
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
                selectedOption === '2' && [0, 2, 6, 8].includes(index);
              const gridItemClassName = `${styles.gridItem} ${isHidden ? styles.hidden : ''
                } ${item.img ? styles.hiddenBorder : ''}`;
              if (item.id === 'name') {
                return (
                  <div className={styles.gridBoardName}>
                    <div>{gridItems[4].text}</div>
                  </div>
                );
              }
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
                                        style={{ visibility: readOnly ? 'hidden' : '' }}
                                    />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {
                readOnly ?
                    <div className={styles.btnContainer}>
                        <button className={styles.deleteBtn} onClick={handleBackToMyCollection}>
                            비전보드 목록
                        </button>
                        <button className={styles.deleteBtn} onClick={() => setReadOnly(false)}>
                            수정하기
                        </button>
                        <button className={styles.deleteBtn} onClick={handleCollectionDelete}>
                            보드 삭제
                        </button>

                    </div>
                    :
                    <div className={styles.btnContainer}>
                        <button className={styles.deleteBtn} onClick={handleDeleteButtonClick}>
                            선택삭제
                        </button>
                        <button className={styles.prevBtn} onClick={() => setReadOnly(true)}>
                            이전
                        </button>
                        <button className={styles.completeBtn} onClick={() => {
                            putApi(gridItems, id, gridItems[4].id.name)
                        }}>완료</button>
                        <select
                            className={styles.selectBtn}
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <option value="1">8</option>
                            <option value="2">4</option>
                        </select>
                    </div>
            }
            {isModalOpen && (
                <EditVisionBoardModal
                    isOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    handleImageAndTextSelect={handleImageAndTextSelect}
                    readOnly={readOnly} setGridItems={setGridItems}
                    gridItems={gridItems}
                />
            )}
        </div>
    );
}
