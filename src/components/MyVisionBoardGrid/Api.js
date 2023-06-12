//데이터 패칭, useEffect로 사용. 이후 post에도 사용.

// export const API_BASE_URL = 'http://localhost:9999/collection';

// `${API_BASE_URL}/${path}`
// const handleError = (err) => { console.log(err) };

// .catch(err => handleError(err)) 이렇게 연결.

// export const fetchPosts = () => {
//   fetch(`/api/v1/visionboard/:id`)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data)
//     })
//     .catch(error => {
//       console.error('Error fetching posts:', error);
//     });
// };


// 데이터 가져오기
export const getApi = async (id) => {
  // 진휘님 post /api/v1/visionboard
  // 내 api /api/v1/visionboard?id=${id}
  // /api/v1/visionboard/${id}
  try {
    const response = await fetch(`/api/v1/visionboard?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('get으로 가져온 response', response)
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();

      return data;
    } else {
      throw new Error('Network response was not successful');
    }

  } catch (error) {
    console.error(error);
    return null;
  }
};



// export const postApi = async (gridItems) => {
//  /api/v1/visionboards?id={}
//   try {
//     컬렉션이름을 유저가 정한 visionboard 이름으로 정하는 방법 찾기
//     const response = await fetch(`${API_BASE_URL}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ name: gridItems })
//     })
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     console.log(data);

//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

export const putApi = async (formData, id, title) => {

  try {

    const response = await fetch(`/api/v1/visionboard?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({ formData })
    })

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error('Network response was not successful');
    }

  } catch (error) {
    console.error(error);
    //에러 처리 로직 필요
  }
}

//폼 데이터를 받아, 수정할 그리드의 데이터에 put, 경로는 api/v1/image?name=${imageName}로 요청.
//api/v1/image?name=${imageName}
export const modalPutApi = async (formData, prevImgName) => {
  try {

    const response = await fetch(`api/v1/image?name=${prevImgName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({ formData })
    })

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error('Network response was not successful');
    }

  } catch (error) {
    console.error(error);

  }
}

export const deleteApi = async (id) => {
  try {

    await fetch(`/api/v1/myvisionboard?id=${id}`, {
      method: 'DELETE',
    })
    console.log('delete성공')
  } catch (error) {
    console.error('Error:', error)
  }
}

