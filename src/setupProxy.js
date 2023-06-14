const { createProxyMiddleware } = require('http-proxy-middleware');
const visionaryIp = process.env.REACT_APP_VISIONARY_IP;

module.exports = function (app) {
  console.log('app', app);
  app.use(
    '/api', // 백엔드에 프록시를 적용할 경로 나열 (path parameter), api 공통

    createProxyMiddleware({
      target: visionaryIp, // 백엔드 서버 주소
      changeOrigin: true,
      secure: false,

      cookieDomainRewrite: 'localhost',
      // 이 줄을 추가하면,
      // 쿠키의 도메인이 백엔드 서버의 주소에서 프론트엔드 서버의 주소로 변경됩니다.
      // 이렇게 하면, 프론트엔드에서 백엔드가 설정한 쿠키를 읽을 수 있습니다.
      // 이 설정은 HTTP Only 쿠키를 사용할 때 유용
    })
  );
};
