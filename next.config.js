module.exports = {
  reactStrictMode: false,
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
    };
    return config;
  },
};
