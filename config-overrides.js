module.exports = function override(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      http: false, // Vô hiệu hóa module http
    };
    return config;
  };
  