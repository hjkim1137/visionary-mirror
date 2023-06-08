// import imageCompression from 'browser-image-compression';
  
//기본 로직

// const saveImgFile = () => {
//   const file = imgRef.current.files[0];
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onloadend = () => {
//     setImgFile(reader.result);
//   };
// };

//폼 데이터 제외 컴프레션

// const saveImgFile = async () => {
//   const uploadedFile = imgRef.current.files[0];

//   const options = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 1920,
//     useWebWorker: true,
//   }

//   try {
//     const compressedFile = await imageCompression(uploadedFile, options);
//     const reader = new FileReader();
//     reader.readAsDataURL(compressedFile);
//     reader.onload = () => {
//       setImgFile(reader.result);
//     }

//   } catch (err) {
//     alert(err)
//   }
// }


//폼데이터

// const saveImgFile = async () => {
//   const uploadedFile = imgRef.current.files[0];

//   const options = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 1920,
//     useWebWorker: true,
//   };

//   try {
//     const compressedFile = await imageCompression(uploadedFile, options);
//     console.log(compressedFile)
//     //FormData를 생성하고, compressedFile을 '유저 비전 보드(임시)'라는 이름으로 추가
//     // 이 부분에 query로 받은 비전보드 이름을 넣을 수 있을 지도.

//     const formData = new FormData();
//     formData.append('유저 비전 보드', compressedFile); 
//     console.log(formData.get('유저 비전 보드'))
//     setImgFile(formData.get('유저 비전 보드'));
//   } catch (err) {
//     console.error(err);
//   }
// };
