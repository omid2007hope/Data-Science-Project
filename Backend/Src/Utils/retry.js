const wait = (ms) => new Promise((res) => setTimeout(res, ms));

exports.withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 429 && retries > 0) {
      await wait(delay);
      return exports.withRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
};
