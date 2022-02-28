const cracoModuleFederation = require("craco-module-federation");
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

module.exports = {
  devServer: {
    port: 4000,
  },
  webpack:{
    plugins:[
      new ExternalTemplateRemotesPlugin()
    ]
  },
  plugins: [
    {
      plugin: cracoModuleFederation,
    },
    
  ],
};
