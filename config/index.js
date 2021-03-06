const path = require('path') // 加在最上面
const config = {
  projectName: 'market-app',
  date: '2021-8-2',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    // 是否自定义tabbar
    NEED_CUSTOM_TABBAR: true
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  alias: {
    /* ---------------- 分包路径 start-------------------------------*/
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/pagesA': path.resolve(__dirname, '..', 'src/pagesA'),
    /* ---------------- 分包路径 end-------------------------------*/

    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/services': path.resolve(__dirname, '..', 'src/services'),
    '@/config': path.resolve(__dirname, '..', 'src/config'),
    '@/api': path.resolve(__dirname, '..', 'src/api'),
    '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@/enum': path.resolve(__dirname, '..', 'src/enum'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets')
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    optimizeMainPackage: {
      enable: true
    },
    webpackChain(chain) {
      // chain
      //   .plugin('analyzer')
      //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      //lodash 瘦身配置
      // 奇怪行为，需要设置这个https://www.npmjs.com/package/lodash-webpack-plugin
      // 也可以移除一些，用来瘦身，目前发现shorthands，coercions，paths是必须的，否则会很诡异
      // chain
      //   .plugin('lodash-webpack-plugin')
      //   .use(require('lodash-webpack-plugin'), [
      //     {
      //       shorthands: true,
      //       cloning: true,
      //       caching: true,
      //       collections: true,
      //       exotics: true,
      //       guards: true,
      //       memoizing: true,
      //       coercions: true,
      //       flattening: true,
      //       paths: true
      //     }
      //   ])
      // // 将 lodash 单独拆分出来 (防止vendors.js过大)
      // chain.merge({
      //   optimization: {
      //     splitChunks: {
      //       cacheGroups: {
      //         lodash: {
      //           name: 'lodash',
      //           priority: 1000,
      //           test(module) {
      //             return /node_modules[\\/]lodash/.test(module.context)
      //           }
      //         }
      //       }
      //     }
      //   }
      // })
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
