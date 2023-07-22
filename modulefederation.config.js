const deps = require('./package.json').dependencies;

const shared = {};
Object.keys(deps).forEach((dep) => {
  shared[dep] = {
    singleton: true,
    eager: dep === 'react',
    requiredVersion: deps[dep]
  };
});
console.log({ shared });

module.exports = {
  name: 'webinvest-module-login-fg',
  library: { type: 'var', name: 'webinvest_module_login_fg' },
  filename: 'remoteEntry.js',
  exposes: {
    './FGFlowManager': './src/FRFlowManager',
    './FGFlowChangePassword': './src/flows/ChangePassword',
    './FGFlowChangeUsername': './src/flows/ChangeUsername',
    './FGFlowEnableMfa': './src/flows/EnableMfa',
    './FGFlowDisableMfa': './src/flows/DisableMfa',
    './FGFlowLogout': './src/flows/logout',
    './WfeFGFlowChangePasswordButton': './src/flows/WfeFRFlowChangePasswordButton',
    './WfeFGFlowChangeUsernameButton': './src/flows/WfeFRFlowChangeUsernameButton',
    './WfeFGFlowEnableDisableMfaContainer': './src/flows/WfeFRFlowEnableDisableMfaContainer',
    './WfeModalProvider': './src/flows/WfeModalProvider',
    './WfeLogout': './src/flows/WfeLogout'
  },
  shared
};
