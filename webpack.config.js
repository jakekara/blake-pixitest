module.exports = {
    entry: {
      main: './src/index.js',
      "vanilla-palettes": './src/vanilla-palettes.js'
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/dist'
    }
  };
  