cracoModuleFederation = require('craco-module-federation');

module.exports = {
  jest: {
    configure: {
      snapshotResolver: './__snapshots__/snapshotResolver.js'
    }
  },
  plugins: [
    {
      plugin: cracoModuleFederation
    }
  ],
  devServer: {
    port: 3000
  }
};
