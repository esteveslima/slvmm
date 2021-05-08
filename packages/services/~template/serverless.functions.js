/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  return functions({
    // someFunction: stage !== 'local' && {
    //   handler: './src/controllers/someController/handler.default',
    //   events: [
    //     {
    //       http: {
    //         method: 'POST',
    //         path: '/somePath',
    //       },
    //     },
    //   ],
    // },
  });
};
