var path = require('path')
var fs = require('fs')
var config = require('../config')
var utils = require('./utils')
var glob = require('glob')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

var projectRoot = path.resolve(__dirname, '../')
var srcDir = path.resolve(__dirname, '../src')
var entries = utils.getEntries(srcDir + '/views/**/*.js')
var libs=path.resolve(__dirname, '../static/js/lib')
entries['flexible'] = path.resolve(__dirname, libs+'/flexible/flexible.js')
var autoprefixerConf = autoprefixer({ browsers: ['last 2 versions','Android >= 4.0','iOS >= 6'] });

module.exports = {
    entry: entries,

    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'vue$': 'vue/dist/vue',
            '@': path.resolve(__dirname, '../src'),
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'images': path.resolve(__dirname, '../src/assets/images'),
            'js': path.resolve(__dirname, '../src/assets/js'),
            'components': path.resolve(__dirname, '../src/components'),
            'scss': path.resolve(__dirname, '../src/assets/scss')
        }
    },

    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    externals: {},
    module: {
        preLoaders: [
		    {
				test: /vue-scroller.src.*?js$/,
				loader: 'babel-loader'
		    },
			{ test: /iview.src.*?js$/, loader: 'babel' },
        	{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ],

        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            /*{
                test: /\.(css|scss)$/,
                loader: "style!css!postcss!sass"
            },*/
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 1024,
                    name: 'user-defined'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
		    {
				test: /vue-scroller.src.*?js$/,
				loader: 'babel-loader'
		    },
			{ test: /iview.src.*?js$/, loader: 'babel' },
        	{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },
    // js 中引入的样式处理
    postcss: [autoprefixerConf],
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        // .vue 中的样式处理
        loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
        postcss: [autoprefixerConf]
    },
    plugins:[]
}
var pages = utils.getEntries('./src/views/**/*.html',1);
var echartsFlag;
for (var pathname in pages) {
  // 生成html相关配置
  echartsFlag = 0;
  var conf = {
    filename: pathname + '.html', // html文件输出路径
    template: pages[pathname],   // 模板路径
    inject: true,                // js插入位置
    minify: {
      //压缩设置
      //removeComments: true,
      //collapseWhitespace: true,
      //removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  };
  if (pathname in module.exports.entry) {
    var template = fs.readFileSync(module.exports.entry[pathname].replace(".html",".js"), 'utf-8');
    
    if(template.indexOf("needEchart")>-1){
        echartsFlag = 1;
    }
    conf.inject = {
        head: ['manifest','flexible','base'],
        body: ['vendor','echarts' , pathname]   
    };
    if(echartsFlag){//需要echarts引入逻辑修改
        conf.chunks = ['flexible',pathname,'vendor','echarts', 'manifest','base'];
    }else{
        conf.chunks = ['flexible',pathname, 'vendor', 'manifest','base'];
    }
    conf.hash = false;
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

