import React, { useState, useRef } from 'react';
import { Modal, Box } from '@mui/material';
import arrowBack from './assets/arrow_back_icon.svg';
import media from './assets/media_icon.svg';

import styles from './CreateVisionBoardModal.module.scss';

export default function CreateVisionBoardModal({
  isOpen,
  closeModal,
  handleImageAndTextSelect,
}) {
  const [imgFile, setImgFile] = useState('');
  const [text, setText] = useState('');
  const [selectedImg, setSelectedImg] = useState('');

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
    reader.onloadend = () => {
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
                accept="image/jpg, image/png, image/jpeg"
                ref={imgRef}
                onChange={saveImgFile}
              />
              <div className={styles.modalPostWrite}>
                <textarea
                  placeholder={'문구입력...'}
                  value={text}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                />
                <p>
                  {characterCount}/{characterLimit} 글자수
                </p>
              </div>
              <button className={styles.modalPostButton} onClick={handleSelect}>
                이미지 선택 완료
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
