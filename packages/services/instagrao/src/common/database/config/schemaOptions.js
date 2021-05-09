const { IS_OFFLINE } = process.env;

export default {
  create: !!IS_OFFLINE,
  waitForActive: {
    enabled: !!IS_OFFLINE,
  },
};
