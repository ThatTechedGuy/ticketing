module.exports = {
  webpackDevMiddleware: (config, options) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
    