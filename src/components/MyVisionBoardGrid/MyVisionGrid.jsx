import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import EditVisionBoardModal from '../VisionBoardModal/EditVisionBoardModal'
import styles from '../VisionBoardGrid/VisionGrid.module.scss';

import { getApi, putApi, deleteApi } from './Api';
import { initGridItmes } from './InitGridItems'

export default function MyVisionGrid() {
    const navigate = useNavigate();
    const location = useLocation();



    const id = useMemo(() => {
        return location.pathname.split('/')[2];
    })
    const [gridItems, setGridItems] = useState([])
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('1');
    const [uploadedText, setUploadedText] = useState(null);
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [readOnly, setReadOnly] = useState(true);
    const [boardName, setBoardName] = useState('');

    // 내 비전보드 페이지 접속시 데이터 패칭
    useEffect(() => {
        const fetchingData = async () => {
            try {
                const result = await getApi(id);
                if (result) {
                    const fetchedData = result.data.visionboardcontentSequence;
                    const fetchedGrid = [
                        { id: fetchedData[0].sequence, img: fetchedData[0].imagePath, text: fetchedData[0].description, isChecked: false },
                        { id: fetchedData[1].sequence, img: fetchedData[0].imagePath, text: fetchedData[1].description, isChecked: false },
                        { id: fetchedData[2].sequence, img: fetchedData[2].imagePath, text: fetchedData[2].description, isChecked: false },
                        { id: fetchedData[3].sequence, img: fetchedData[3].imagePath, text: fetchedData[3].description, isChecked: false },
                        { id: result.data.title },
                        { id: fetchedData[4].sequence, img: fetchedData[4].imagePath, text: fetchedData[4].description, isChecked: false },
                        { id: fetchedData[5].sequence, img: fetchedData[5].imagePath, text: fetchedData[5].description, isChecked: false },
                        { id: fetchedData[6].sequence, img: fetchedData[6].imagePath, text: fetchedData[6].description, isChecked: false },
                        { id: fetchedData[7].sequence, img: fetchedData[7].imagePath, text: fetchedData[7].description, isChecked: false },
                    ]
                    setGridItems(fetchedGrid)
                    console.log(`받아온 데이터 확인`, fetchedData);

                } else {
                    throw new Error('유저 비전 보드 그리드 가져오기 실패')
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchingData();
    }, []);

    useEffect(() => {
        checkUploadComplete();
    }, [gridItems, selectedOption]);

    // 목록으로 돌아가기 버튼
    const handleBackToMyCollection = useCallback(() => {
        navigate('/myvisionboard/list')
    }, [])
    // 비전보드 삭제 버튼
    const handleBoardDelete = useCallback(() => {
        if (window.confirm('현재 열람중인 비전보드를 삭제하시겠습니까?')) {
            deleteApi(id);
            handleBackToMyCollection();
        }
    }, [])

    const checkUploadComplete = () => {
        const requiredUploadCount = getRequiredUploadCount();
        let count = 0;

        for (const item of gridItems) {
            if (item.img && item.text) {
                count++;
            }
        }
        setUploadCount(count);
        setIsUploadComplete(count === requiredUploadCount);
    };

    const getRequiredUploadCount = () => {
        return selectedOption === '1' ? 8 : 4;
    };

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

    const handleImageAndTextSelect = (imgData, textData, imgPreview) => {
        setGridItems((prevGridItems) => {
            const updatedGridItems = [...prevGridItems];
            const selectedItem = updatedGridItems[selectedItemIndex];
            selectedItem.img = imgData;
            selectedItem.text = textData;
            selectedItem.imgPreview = imgPreview;
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

    const handlePutCompleteButtonClick = async (e) => {
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

        console.log(Array.from(formData.entries()));
        console.log(formData);

        for (const item of gridItems) {
            console.log(item, item.img);
            if (item.img) {
                formData.append(`image${imageIndex}`, item.img);
                imageIndex++;
            }
            if (item.text) {
                formData.append(`description${descriptionIndex}`, item.text);
                descriptionIndex++;
            }
        }

        formData.append('title', gridItems[4].id);

        putApi(formData, id)

    };

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {gridItems.map((item, index) => {
                    const isHidden =
                        selectedOption === '2' && [0, 2, 6, 8].includes(index);
                    const gridItemClassName = `${styles.gridItem} ${isHidden ? styles.hidden : ''
                        } ${item.img ? styles.hiddenBorder : ''}`;
                    if (item.id === gridItems[4].id) {
                        return (
                            <div className={styles.gridBoardName}>
                                <div>{gridItems[4].id}</div>
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
                            onClick={() => {
                                handleGridItemClick(index)
                            }}
                        >
                            {item.id !== 'name' && (
                                <>
                                    {item.imgPreview && (
                                        <img src={item.imgPreview} alt="Selected" />
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
                        <button className={styles.deleteBtn} onClick={() => handleBackToMyCollection}>
                            비전보드 목록
                        </button>
                        <button className={styles.deleteBtn} onClick={() => setReadOnly(false)}>
                            수정하기
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleBoardDelete}>
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
                        <button className={styles.completeBtn} onClick={handlePutCompleteButtonClick}>
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
