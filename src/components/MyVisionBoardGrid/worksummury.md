유저가 저장한 비전보드를 그대로 불러와야함

1. 목록 버튼 ✔️
-내 컬렉션 목록으로 돌아가는 버튼 handleBackToMyCollection 함수 구현하여 이동하게끔 했습니다.
-useCallback을 사용해서 한번만 불리게 만들었습니다. 

2. 수정 완료 버튼 : 
put api 구현

3. 보드 삭제 버튼
-confirm 받아 수락시 alert로 명시 이후 /myvisionboard로 이동✔️ handleCollectionDelete
-보드 db에서 삭제

p.s. 각 버튼들 className은 그냥 일괄적으로 delete로 통일하였습니다. css는 진휘님 입맛에 맞게 꾸미시면 됩니다.

npx json-server --port 9999 --watch db.json

http://localhost:9999/collection

VisionGridComponent,
CreateVisionBoardModal 에 readOnly 프롭스 추가하여 읽기/수정에 따라 화면/기능 다르게 구현.


<23.06.08>
1.수정 완료시 put
2.삭제 버튼 delete api
3.EditVisionBoardModal.jsx 수정 : 
-이미지 프리뷰가 안 뜨므로 일단 프리뷰 뜨게 한 뒤에 압축하는 방향으로 ✔️
-formData.append('image', compressedFile, uploadedFile.name); name에 파일 이름 들어가게 됨.✔️ 
-key 값 존재. 객체에 통으로 담겨있는지? 질문.
-savedImgFile.name = value로 넘어갈 값.✔️
-넘어가는 데이터 생김새 BE에 알려주기.
5. 각 fetch코드에서 결과값 받아온 후에 분기처리.
↓↓
양식
{
   err: {
      "statusCode": 404,
      "message": "Cannot POST /api/v1/mainvisionboard1",
    },
   data: null 
 }

err: 인증오류 에러 / 기타 에러 구분해서.

ex.예제
const fetchResult = fetch("/api")
if (!fetchResult.error) {
    console.log('api 통신 성공')
}

if (fetchResult.error && fetchResult.error.statusCode === 401) {
   if (fetchResult.error.statusCode === 401) {
        // 인증실패일 경우 다시 로그인을 유도
        console.log("사용자 인증 오류")
        localStorage.removeItem("isLogin"); 
        navigate("/");
   }else{
       console.log("나머지 오류")
       alert("에러남")
   }
}