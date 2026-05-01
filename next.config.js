module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['foot-print-resources.s3.ap-northeast-2.amazonaws.com'],
  },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
    };
    return config;
  },
  async headers() {
    // Universal Links / App Links 검증 파일에 application/json 응답 헤더 강제.
    // public/.well-known/apple-app-site-association 는 확장자가 없어
    // 기본 MIME 추정이 application/octet-stream 이 될 수 있음 → OS가 거부함.
    // assetlinks.json 도 일관성을 위해 명시.
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};
