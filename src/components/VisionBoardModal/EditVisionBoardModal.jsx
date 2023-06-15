import React, { useState, useRef } from 'react';
import { Modal, Box } from '@mui/material';
import arrowBack from './assets/arrow_back_icon.svg';
import media from './assets/media_icon.svg';

import styles from './CreateVisionBoardModal.module.scss';
import axios from 'axios';

export default function EditVisionBoardModal({
  isOpen,
  closeModal,
  handleImageAndTextSelect,
  readOnly,
  gridItems,
  selectedGrid,
  prevImgGrid,
  id,
  dataLength
}) {

  const [imgFile, setImgFile] = useState('');
  const [text, setText] = useState('');
  const [selectedImg, setSelectedImg] = useState('');

  const textRef = useRef(null);
  const imgRef = useRef(null);

  const handleModalClose = () => {
    if (window.confirm('게시물 작성을 취소하시겠습니까?')) {
      closeModal();
    }
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgFile(reader.result);
      setSelectedImg(reader.result);
    };

  };

  const handleSelect = () => {
    if (imgFile && text) {
      const file = imgRef.current.files[0];

      handleImageAndTextSelect(file, text, selectedImg);

      closeModal();
    } else {
      alert('이미지와 문구를 모두 등록해 주세요.');
    }
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 70) {
      setText(inputText);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setText((prevText) => prevText + '\n');
    }
  };

  const modalImgPutApi = async () => {
    const formData = new FormData();
    formData.append('image', imgRef.current.files[0]);

    try {
      const response = await axios.put(`/api/v1/images?name=${prevImgGrid[selectedGrid].fileName}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('img put data 전송 완료', response);
      } else {
        throw new Error('Network response was not successful');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const modalTextPutApi = async () => {
    const gridNumber = selectedGrid + 0;
    let sequence = {};

    switch (dataLength) {
      case 8:
        sequence = {
          number: gridNumber <= 4 ? gridNumber + 1 : gridNumber,
          description: textRef.current.value
        }
        break;
      case 4:
        sequence = {
          number: parseInt((gridNumber + 1) / 2),
          description: textRef.current.value
        }
        break;
      default:
        console.log('modalPutApi default')
    }

    const requestData = {
      title: gridItems[4].id,
      sequence: sequence,
    }

    try {
      const response = await axios.put(`/api/v1/visionboard?id=${id}`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('text put data 전송 완료', response);

      } else {
        throw new Error('Network response was not successful');
      }
    } catch (error) {
      console.error(error);
    }
  }


  const characterCount = text.length;
  const characterLimit = 70;

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} onClose={handleModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 650,
              height: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className={styles.modalHeader}>
              <button
                onClick={handleModalClose}
                className={styles.modalCloseButton}
              >
                <img width="22px" height="22px" src={arrowBack} alt="닫기" />
              </button>
              <p className={styles.modalTitle}>이미지 올리기</p>
            </div>
            <div className={styles.modalMain}>
              <div className={styles.modalUploadFile}>
                <img
                  className={styles.modalUploadImg}
                  src={imgFile ? imgFile : media}
                  width={imgFile ? `100%` : `50%`}
                  height={imgFile ? `100%` : `50%`}
                  alt="미리보기"
                />
              </div>
              <input
                type="file"
                id="file"
                accept="image/*"
                ref={imgRef}
                onChange={saveImgFile}
                disabled={readOnly}
              />
              <div className={styles.modalPostWrite}>
                <textarea
                  placeholder={'문구입력...'}
                  value={text}
                  ref={textRef}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  readOnly={readOnly}
                />
                <p>
                  {characterCount}/{characterLimit} 글자수
                </p>
              </div>
              <button className={styles.modalPostButton} onClick={() => {
                handleSelect()
                modalImgPutApi()
                modalTextPutApi()
                // console.log('gridItems[4].id', gridItems[4].id)
                console.log('prevImgGrid[selectedGrid].fileName', prevImgGrid[selectedGrid].fileName)

                console.log('gridItems', gridItems)
              }}>
                이미지 선택 완료
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
