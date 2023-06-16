export const getApi = async (id) => {

  try {
    const response = await fetch(`/api/v1/visionboard?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      console.log('get 성공 data', data)
      return data;
    } else {
      throw new Error('Network response was not successful');
    }

  } catch (error) {
    console.error(error);
    return null;
  }
};

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

