import React, { useState, useRef } from 'react';
import { Modal, Box } from '@mui/material';
import arrowBack from './assets/arrow_back_icon.svg';
import media from './assets/media_icon.svg';

import styles from './CreateVisionBoardModal.module.scss';
import imageCompression from 'browser-image-compression';

import { modalPutApi } from '../MyVisionBoardGrid/Api'

export default function EditVisionBoardModal({
  isOpen,
  closeModal,
  handleImageAndTextSelect,
  readOnly,
  gridItems,
  setGridItems
}) {

  const [imgFile, setImgFile] = useState('');
  const [text, setText] = useState('');

  const imgRef = useRef(null);

  const handleModalClose = () => {
    if (window.confirm('게시물 작성을 취소하시겠습니까?')) {
      closeModal();
    }
  };

  const saveImgFile = async () => {
    const uploadedFile = imgRef.current.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      //파일 크기 압축
      const compressedFile = await imageCompression(uploadedFile, options);


      //미리보기 및 imgFile 상태 변경
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setImgFile(reader.result);
      };

      //압축파일 폼 데이터 화
      const formData = new FormData();
      formData.append('image', compressedFile, uploadedFile.name);

      return formData.get('image');
      

      
      // let gridImgIndex = 1;
      // let gridTextIndex = 1;
  
      // for (const item of gridItems) {
      //   if (item.img) {
      //     formData.append(`image${gridImgIndex}`, item.img);
      //     gridImgIndex++;
      //   }
      //   if (item.text) {
      //     formData.append(`description${gridTextIndex}`, item.text);
      //     gridTextIndex++;
      //   }
      // }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = () => {
    if (imgFile && text) {
      // 이미지와 문구 모두 등록되어 있는지 확인
      const file = imgRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        var selectedImg = reader.result;
        handleImageAndTextSelect(selectedImg, text);
      };

      closeModal();
    } else {
      alert('이미지와 문구를 모두 등록해 주세요.'); // 경고 메시지 표시
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

  const savedImgToModalPutApi = async () => {
    // 넘겨야 할 폼 데이터
    const formData = await saveImgFile();
    // 폼 데이터에서 확장자 뗀 파일 이름
    // const trimedDataName = formData.name.split('.')[0]
    console.log('savedImgToModalPut ~ formData:', formData)
    // console.log('trimedDataName', trimedDataName)
    // console.log('prevImgName', prevImgName)

    // modalPutApi(formData, prevImgName)

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
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  readOnly={readOnly}
                />
                <p>
                  {characterCount}/{characterLimit} 글자수
                </p>
              </div>
              <button className={styles.modalPostButton} onClick={() => {
                savedImgToModalPutApi()
                handleSelect()
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
