const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const base = {
    mode: 'production',
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src'),
            query: {
                presets: [['@babel/preset-env', {targets: {browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']}}]]
            }
        },
        {
            test: /\.mp3$/,
            loader: 'file-loader'
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
            })
        ]
    },
    plugins: []
};

module.exports = [
    // Web-compatible
    defaultsDeep({}, base, {
        target: 'web',
        entry: {
            'scratch-pen': './src/extensions/scratch3_pen/index.js',
            'scratch-music': './src/extensions/scratch3_music/index.js',
            'scratch-text2speech': './src/extensions/scratch3_text2speech/index.js',
            'scratch-translate': './src/extensions/scratch3_translate/index.js',
            'scratch-video-sensing': './src/extensions/scratch3_video_sensing/index.js',
            'scratch-makeymakey': './src/extensions/scratch3_makeymakey/index.js'
        },
        output: {
            libraryTarget: 'umd',
            path: path.resolve('dist', 'scratch-extension'),
            filename: '[name].js'
        },
        module: {

        }
    })
];
