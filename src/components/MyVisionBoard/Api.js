const myvisioboardAPI = '/api/v1/myvisionboard';

export const getAPI = async ({ navigate }) => {
  try {
    const response = await fetch(`${myvisioboardAPI}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchResult = await response.json();

    if (
      fetchResult &&
      fetchResult.error &&
      fetchResult.error.statusCode === 401
    ) {
      console.log('사용자 인증 오류');
      localStorage.removeItem('isLogin');
      alert(
        '사용자 인증 오류가 발생하였습니다. 새로고침 후 재 로그인해주세요.'
      );
      navigate('/login');
      return;
    } else if (fetchResult && fetchResult.error) {
      console.log('401번 외 오류 발생');
      alert('에러가 발생하였습니다. 새로고침 후 다시 시도해주세요.');
      navigate('/');
      return;
    }
    return fetchResult;
  } catch (error) {
    console.log('통신 에러', error.message);
    alert('서버와 통신에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
    navigate('/');
    return;
  }
};

export const deleteAPI = async ({ navigate, id }) => {
  try {
    const response = await fetch(`${myvisioboardAPI}?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchResult = await response.json();

    if (
      fetchResult &&
      fetchResult.error &&
      fetchResult.error.statusCode === 401
    ) {
      console.log('사용자 인증 오류');
      localStorage.removeItem('isLogin');
      alert(
        '사용자 인증 오류가 발생하였습니다. 새로고침 후 재 로그인해주세요.'
      );
      navigate('/login');
      return;
    } else if (fetchResult && fetchResult.error) {
      console.log('401번 외 오류 발생');
      alert('에러가 발생하였습니다. 새로고침 후 다시 시도해주세요.');
      navigate('/');
      return;
    }

    return fetchResult;
  } catch (error) {
    console.log('통신 에러', error.message);
    alert('서버와 통신에 실패하였습니다. 새로고침 후 다시 시도해주세요.');
    navigate('/');
    return;
  }
};
