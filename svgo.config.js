module.exports = {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: true
  },
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // disable removeViewBox
          removeViewBox: false
        }
      }
    },
    // enable removeDimensions
    "removeDimensions"
  ]
};
