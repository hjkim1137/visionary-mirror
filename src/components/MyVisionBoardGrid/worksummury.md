유저가 저장한 비전보드를 그대로 불러와야함

1. 목록 버튼 ✔️
-내 컬렉션 목록으로 돌아가는 버튼 handleBackToMyCollection 함수 구현하여 이동하게끔 했습니다.
-useCallback을 사용해서 한번만 불리게 만들었습니다. 

2. 수정 완료 버튼 : 
grid 빈 ui를 따로 구현해두고 저장해둔 데이터를 뽑아서 각 state를 업데이트 시킨다면? id 순서에 따라 map으로 차례로 들어가게 하면 될 거 같은데.

3. 보드 삭제 버튼
-confirm 받아 수락시 alert로 명시 이후 /myvisionboard로 이동✔️ handleCollectionDelete
-보드 db에서 삭제



p.s. 각 버튼들 className은 그냥 일괄적으로 delete로 통일하였습니다. css는 진휘님 입맛에 맞게 꾸미시면 됩니다.

npx json-server --port 9999 --watch db.json

http://localhost:9999/collection

VisionGridComponent,
CreateVisionBoardModal 에 readOnly 프롭스 추가하여 읽기/수정에 따라 화면/기능 다르게 구현.


남은 거 : 완료버튼 눌러서 db에 저장.

<합동 오피스 질문>
ImgCompression.js
createvisionboardmodal ln 70 => 이때 이미지를 formData를 사용.

-만약 formData를 통해 넘긴다면 formData.append('유저 비전 보드', compressedFile); 형식으로 가공이 가능해서 query로 비전보드 이름 가져와서 넣을 수 있음.
