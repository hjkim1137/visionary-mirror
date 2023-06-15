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

2.삭제 버튼 delete api ✔️

-savedImgFile.name = value로 넘어갈 값.✔️

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
1. putApi : 완료버튼 누를 경우 path에 유저컬렉션에 해당하는 endpoint할당필요.✔️
3. get 가져와서 보여주고 수정버튼으로 put✔️
5. 이미지 미리보기 따로, form 데이터 넘겨주기 따로 구현.✔️
6. 유저가 지정한 title로 컬렉션이름 지정하기 
7. visionboardgrid에서 be로 넘긴 name을 가져와서 내 그리드 가운데에 노출.✔️



db에서 경로에 맞는 이미지 가져와서 보여주기. << 백엔드 도움 필요 >>

모달쪽 로직 균일화✔️
모달 put 구현
myvisiongrid 229번쨰줄. 타이틀 표시하는 거 고쳐야함.
미리보기 문제 해결✔️
타이틀 수정 x 니까 기존 가져온 타이틀 데이터를 보여주면 도리듯.
--editmodal---
모달을 켠 grid의 id값 구하기.
---visionboard---
api 명세 따지기.







수정시 text 2번 기입 문제 : ??
api문제 : 전반적으로