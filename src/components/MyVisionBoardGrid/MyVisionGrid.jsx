import React, { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import VisionGridComponent from './VisionGridComponent';
import EditVisionBoardModal from '../VisionBoardModal/EditVisionBoardModal'
import styles from '../VisionBoardGrid/VisionGrid.module.scss';

import { getApi, putApi, deleteApi } from './Api';
import {initGridItmes} from './InitGridItems'

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getApi(id);
                if (result) {
                    setGridItems(result)
                    console.log('gridItems 패칭확인:', gridItems)
                } else {
                    throw new Error('No fetching data available')
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData();
    }, []);

    const [gridItems, setGridItems] = useState(initGridItmes)
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('1');
    const [uploadedText, setUploadedText] = useState(null);

    const [readOnly, setReadOnly] = useState(true);

    const handleGridItemClick = (index) => {
        if (gridItems[index].id !== 'name') {
            // console.log('gridItems[index]:', gridItems[index])
            setSelectedItemIndex(index);
            if (readOnly === true) {
                setIsModalOpen(false)
            } else {
                setIsModalOpen(true);
            }

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
            <VisionGridComponent gridItems={gridItems} selectedOption={selectedOption}
                selectedItemIndex={selectedItemIndex} uploadedText={uploadedText}
                handleCheckboxClick={handleCheckboxClick} handleGridItemClick={handleGridItemClick}
                readOnly={readOnly} />
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
