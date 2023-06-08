//데이터 패칭, useEffect로 사용. 이후 post에도 사용.

const fetchPosts = () => {
    fetch('http://localhost:9999/collection')
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  };
  
  // 데이터 가져오기
  const getPost = () => {
    fetch('http://localhost:9999/collection')
      .then(res => res.json())
      .then(data => console.log(data))
      
  }
  
  const editPost = () =>{
    fetch('http://localhost:9999/collection', {
      method: 'PUT',
      headers:{
        'Content-Type' : 'application/json',
      },
      body : {
        id : "id수정",
        img : "img수정",
        text :  "text수정",
      }
    })
  }
  
  const createPost = async (gridItems, selectedItemIndex) =>{
    const {id, img, text} = gridItems[selectedItemIndex];
    console.log(id)
    console.log(img)
    console.log(text)
  
    await fetch('http://localhost:9999/collection', {
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        gridId : id,
        img : '이미지 넘겨 받기 백엔드랑 상의',
        text :text,
      })
    })
  }
  
  // const deletePost = () => {
  //   fetch('http://localhost:9999/collection',{
  //     method : 'DELETE',
  
  //   }
  //   )
  // }
  
  export { fetchPosts, getPost, createPost, editPost };
