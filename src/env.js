const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
  // dotenv вернет объект с полем parsed 
  const env = dotenv.config().parsed;
  
  // сделаем reduce, чтобы сделать объект
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };
};

// export default {
//     URL_API,
//     CLIENT_KEY,
//     INVITE_REG,
// };