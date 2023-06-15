import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import EditVisionBoardModal from '../VisionBoardModal/EditVisionBoardModal'
import styles from './MyVisionGrid.module.scss';
import axios from 'axios';

import { getApi, putApi, deleteApi } from './Api';

export default function MyVisionGrid() {
    const navigate = useNavigate();
    const location = useLocation();
    const visionaryIp = process.env.REACT_APP_VISIONARY_IP;

    const id = useMemo(() => {
        return location.pathname.split('/')[2];
    })
    const [gridItems, setGridItems] = useState([])
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [selectedGrid, setSelectedGrid] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('1');
    const [uploadedText, setUploadedText] = useState(null);
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [readOnly, setReadOnly] = useState(true);
    const [prevImgGrid, setPrevImgGrid] = useState([]);
    const [gridTitle, setGridTitle] = useState('')
    const [dataLength, setDataLength] = useState('')


    // 내 비전보드 페이지 접속시 데이터 패칭
    useEffect(() => {
        const fetchingData = async () => {
            try {
                const result = await getApi(id);
                if (result) {
                    const fetchedData = result.data.visionboardcontentSequence;
                    const dataLength = fetchedData.length;
                    setDataLength(dataLength);
                    let fetchedGrid = [];
                    let prevImg = [];

                    if (dataLength === 8) {
                        fetchedGrid = [
                            { key: 1, id: fetchedData[0].sequence, img: fetchedData[0].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[0].description, isChecked: false },
                            { key: 2, id: fetchedData[1].sequence, img: fetchedData[1].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[1].description, isChecked: false },
                            { key: 3, id: fetchedData[2].sequence, img: fetchedData[2].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[2].description, isChecked: false },
                            { key: 4, id: fetchedData[3].sequence, img: fetchedData[3].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[3].description, isChecked: false },
                            { key: 9, id: result.data.title },
                            { key: 5, id: fetchedData[4].sequence, img: fetchedData[4].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[4].description, isChecked: false },
                            { key: 6, id: fetchedData[5].sequence, img: fetchedData[5].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[5].description, isChecked: false },
                            { key: 7, id: fetchedData[6].sequence, img: fetchedData[6].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[6].description, isChecked: false },
                            { key: 8, id: fetchedData[7].sequence, img: fetchedData[7].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[7].description, isChecked: false },
                        ];
                        setGridTitle(result.data.title)
                        prevImg = [
                            { id: 1, fileName: fetchedData[0].fileName },
                            { id: 2, fileName: fetchedData[1].fileName },
                            { id: 3, fileName: fetchedData[2].fileName },
                            { id: 4, fileName: fetchedData[3].fileName },
                            { id: result.data.title },
                            { id: 5, fileName: fetchedData[4].fileName },
                            { id: 6, fileName: fetchedData[5].fileName },
                            { id: 7, fileName: fetchedData[6].fileName },
                            { id: 8, fileName: fetchedData[7].fileName },
                        ];

                    } else if (dataLength === 4) {
                        fetchedGrid = [
                            { key: 1},
                            { key: 2, id: fetchedData[0].sequence, img: fetchedData[0].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[0].description, isChecked: false },
                            { key: 3},
                            { key: 4, id: fetchedData[1].sequence, img: fetchedData[1].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[1].description, isChecked: false },
                            { key: 9, id: result.data.title },
                            { key: 5, id: fetchedData[2].sequence, img: fetchedData[2].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[2].description, isChecked: false },
                            { key: 6},
                            { key: 7, id: fetchedData[3].sequence, img: fetchedData[3].imagePath.replace('/home/elice/projects/visionary', visionaryIp), text: fetchedData[3].description, isChecked: false },
                            { key: 8},
                        ];
                        setGridTitle(result.data.title)
                        prevImg = [
                            { id: 1, fileName: '' },
                            { id: 2, fileName: fetchedData[0].fileName },
                            { id: 3, fileName: '' },
                            { id: 4, fileName: fetchedData[1].fileName },
                            { id: result.data.title },
                            { id: 5, fileName: fetchedData[2].fileName },
                            { id: 6, fileName: '' },
                            { id: 7, fileName: fetchedData[3].fileName },
                            { id: 8, fileName: '' }
                        ];

                    }
                    setPrevImgGrid(prevImg);
                    setGridItems(fetchedGrid);
                    console.log('받아온 데이터 확인 fetchedData', fetchedData);
                    console.log('데이터 그리드 배치 fetchedGrid', fetchedGrid);
                    console.log('prevImg', prevImg)
                } else {
                    throw new Error('유저 비전 보드 그리드 가져오기 실패');
                }
            } catch (error) {
                console.error(error);
            }
        };

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
            console.log('삭제됨')
            deleteApi(id)
            handleBackToMyCollection()
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
            setSelectedGrid(index);
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
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {gridItems.map((item, index) => {
                    const isHidden =
                        selectedOption === '2' && [0, 2, 6, 8].includes(index);
                    const gridItemClassName = `${styles.gridItem} ${isHidden ? styles.hidden : ''
                        } ${item.img ? styles.hiddenBorder : ''}`;
                    if (item.id === gridTitle) {
                        return (
                            <div key={item.key} className={styles.gridBoardName}>
                                <div>{gridTitle}</div>
                            </div>
                        );
                    }
                    return (
                        <div
                            key={item.key}
                            className={
                                item.id === gridTitle
                                    ? styles.gridItemName
                                    : `${gridItemClassName} ${styles.hoverable}`
                            }
                            onClick={() => {
                                handleGridItemClick(index)
                            }}
                        >
                            {item.id !== 'name' && (
                                <>
                                    {
                                        item.imgPreview ? (
                                            <img src={item.imgPreview} alt="Selected" />
                                        ) : (
                                            gridItems[index].img && <img src={gridItems[index].img} alt="Selected" />
                                        )
                                    }
                                    {item.text && (
                                        <div className={styles.gridItemText}>
                                            {item.text}
                                            {item.id === selectedItemIndex && uploadedText && (
                                                <div>{uploadedText}</div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {
                readOnly ?
                    <div className={styles.btnContainer}>
                        <button className={styles.deleteBtn} onClick={() => {
                            handleBackToMyCollection()
                        }}>
                            비전보드 목록
                        </button>
                        <button className={styles.deleteBtn} onClick={() => setReadOnly(false)}>
                            수정하기
                        </button>
                        <button className={styles.deleteBtn} onClick={() => {
                            handleBoardDelete()
                        }}>
                            보드 삭제
                        </button>

                    </div>
                    :
                    <div className={styles.btnContainer}>
                        <button className={styles.prevBtn} onClick={() => setReadOnly(true)}>
                            이전
                        </button>
                        <form>
                            <button className={styles.completeBtn} onClick={handlePutCompleteButtonClick}>
                                완료
                            </button>
                        </form>

                    </div>
            }
            {isModalOpen && (
                <EditVisionBoardModal
                    isOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    handleImageAndTextSelect={handleImageAndTextSelect}
                    readOnly={readOnly} setGridItems={setGridItems}
                    gridItems={gridItems} selectedGrid={selectedGrid}
                    prevImgGrid={prevImgGrid} id={id} dataLength={dataLength}
                />
            )}
        </div>
    );
}
