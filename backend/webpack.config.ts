import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

export default {
    entry: ['webpack/hot/poll?1000', './src/main.ts'],
    watch: true,
    target: 'node',
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?1000'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: "development",
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.webpack.js',
    },
};
