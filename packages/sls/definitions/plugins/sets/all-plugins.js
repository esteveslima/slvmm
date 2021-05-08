/* eslint-disable no-template-curly-in-string */
const path = require('path');

// Temporary structure until framework doesn't support to set plugins with their configurations

const pluginsAssets = path.resolve(`${__dirname}/../assets`);
const monorepoRoot = '../../';
const serviceTempDir = '.temp/';

module.exports = {

  'serverless-webpack': {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: { forceExclude: ['aws-sdk'] },
      keepoutputDirectory: true,
    },
  },

  'serverless-s3-local': {
    s3: {
      address: 'localhost',
      host: 'localhost',
      port: '4569',
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
      httpsProtocol: `${pluginsAssets}/local-ssl-tls`,
      directory: `${serviceTempDir}/.s3-local`,
      silent: true,
    },
  },

  'serverless-offline': {
    'serverless-offline': {
      httpsProtocol: `${pluginsAssets}/local-ssl-tls`,
      host: '0.0.0.0',
      httpPort: '4000',
    },
  },

  // 'serverless-plugin-scripts': {
  //   scripts: {
  //     commands: {
  //       teste: `. ${monorepoRoot}/resources/scripts/update-aws-keys-prod.sh`,
  //       checkdeploystage: `${pluginsAssets}/scripts/check-deploy-stage.sh`,
  //     },
  //     hooks: {

  //       'before:offline:start': `${pluginsAssets}/scripts/check-dev-env.sh`,

  //       'before:deploy:deploy': `\
  //         ${pluginsAssets}/scripts/check-dev-env.sh && \
  //         printf "\nDeployment starting...\n\n"
  //       `,

  //       'after:deploy:finalize': 'printf "\nDeployment finished\n\n"',
  //     },
  //   },
  // },

  'serverless-iam-roles-per-function': {},

};
