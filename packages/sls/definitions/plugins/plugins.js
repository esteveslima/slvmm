const allPlugins = require('./sets/all-plugins');

module.exports = {
  allPlugins: Object.keys(allPlugins),

  pluginsCustoms: (plugins) => {
    const customs = plugins.reduce((acc, curr) => {
      const [key, value] = [Object.keys(allPlugins[curr])[0], Object.values(allPlugins[curr])[0]];
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    return customs;
  },
};
