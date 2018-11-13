
class JavaScriptSetup {
  constructor(javaScriptFilename) {
    this.javaScriptFilename_ = javaScriptFilename;
  }

  createConfig(javaScriptPath) {
    const config = {
      entry: [javaScriptPath],
      output: {filename: this.javaScriptFilename_, path: __dirname},
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {plugins: ['@babel/plugin-transform-react-jsx']}
          }
        }],
      },
    };
    return config;
  }

  getScript() {
    return "<script src='"+this.javaScriptFilename_+"'></script>";
  }
}

module.exports = JavaScriptSetup;
