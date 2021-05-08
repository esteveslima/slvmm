/* eslint-disable no-console */
const { IS_OFFLINE } = process.env;

export default {
  log: (...data) => {
    // if (IS_OFFLINE) return;
    console.log(...data);
  },
  info: (...data) => {
    // if (IS_OFFLINE) return;
    console.info(...data);
  },
  warn: (...data) => {
    // if (IS_OFFLINE) return;
    console.warn(...data);
  },
  error: (...data) => {
    // if (IS_OFFLINE) return;
    console.error(...data);
  },
};
