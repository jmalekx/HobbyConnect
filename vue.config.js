const path = require('path');

module.exports = {
  chainWebpack: config => {
    // Set the entry point to the correct path
    config.entry('app').clear().add('./frontend/src/main.ts');
    
    // Set the alias for '@' to point to 'frontend/src'
    config.resolve.alias.set('@', path.resolve(__dirname, 'frontend/src'));
  }
};
