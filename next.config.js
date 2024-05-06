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
};
