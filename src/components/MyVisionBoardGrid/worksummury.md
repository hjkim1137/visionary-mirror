유저가 저장한 비전보드를 그대로 불러와야함

1. 목록 버튼 ✔️
-내 컬렉션 목록으로 돌아가는 버튼 handleBackToMyCollection 함수 구현하여 이동하게끔 했습니다.
-useCallback을 사용해서 한번만 불리게 만들었습니다. 

2. 수정 완료 버튼 : 
put api 구현

3. 보드 삭제 버튼
-confirm 받아 수락시 alert로 명시 이후 /myvisionboard로 이동✔️ handleCollectionDelete
-보드 db에서 삭제

npx json-server --port 9999 --watch db.json

http://localhost:9999/collection

VisionGridComponent,
CreateVisionBoardModal 에 readOnly 프롭스 추가하여 읽기/수정에 따라 화면/기능 다르게 구현.


<23.06.08>
1.수정 완료시 put -pp
2.삭제 버튼 delete api ✔️
3.EditVisionBoardModal.jsx 수정 : 
-이미지 프리뷰가 안 뜨므로 일단 프리뷰 뜨게 한 뒤에 압축하는 방향으로 ✔️
-formData.append('image', compressedFile, uploadedFile.name); name에 파일 이름 들어가게 됨.✔️ 
-key 값 존재. 객체에 통으로 담겨있는지? 질문.
-savedImgFile.name = value로 넘어갈 값.✔️
-넘어가는 데이터 생김새 BE에 알려주기.
5. 각 fetch코드에서 결과값 받아온 후에 분기처리. 
↓↓
양식은 이렇게 들어옴. 에러나면 아래와 같이, 성공하면 data는 null로 뜬다는 뜻.
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
        //오류뜨면 로컬 스토리지에서 로그인상태를 지워서 로그인 해제
        navigate("/");
   }else{
       console.log("나머지 오류")
       alert("에러남")
   }
}



postApi에 콜백으로 grid 전체를 하나로 저장하는 바업 찾기.

<2주차~
1. putApi : 완료버튼 누를 경우 path에 유저컬렉션에 해당하는 endpoint할당필요.
2. 모달창 이미지 선택 완료시 fetch('api/v1/image?name={기존이미지이름}`), put으로 변경할 이미지 전송
3. get 가져와서 보여주고 수정버튼으로 put
4. query로 title 가져오기
5. 이미지 미리보기 따로, form 데이터 넘겨주기 따로 구현.
6. 유저가 지정한 title로 컬렉션이름 지정하기 ✔️
7. visionboardgrid에서 be로 넘긴 name을 가져와서 내 그리드 가운데에 노출.
8. 페이지 url에서 id값 가져와 변수 지정. ✔️
